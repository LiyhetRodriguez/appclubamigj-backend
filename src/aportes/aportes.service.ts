import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aporte } from 'src/entities/aporte.entity';
import * as mercadopago from 'mercadopago';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AportesService {
  constructor(
    @InjectRepository(Aporte)
    private aportesRepository: Repository<Aporte>,
    private configService: ConfigService,
  ) {}

  findAll() {
    return this.aportesRepository.find();
  }

  findOne(id: number) {
    return this.aportesRepository.findOne({ where: { id } });
  }

  create(data: Partial<Aporte>) {
    const aporte = this.aportesRepository.create(data);
    return this.aportesRepository.save(aporte);
  }

  async createPreference(data: { usuarioId: number; monto: number; descripcion?: string }) {
    // Prefer ConfigService but fall back to direct env var to be more robust
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') ?? process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured. Set the env var in the same shell where you start the server or add it to backend/.env');
    }
    // Normalize SDK import: it may be exported as default or as module object depending on ESM/CommonJS
    const mpModule: any = mercadopago as any;
    const mp = mpModule.default ?? mpModule;
    // Try common configuration entrypoints. If SDK doesn't expose them, fall back to HTTP API.
    let useSdk = true;
    try {
      if (typeof mp.configure === 'function') {
        mp.configure({ access_token: accessToken });
      } else if (mp.configurations && typeof mp.configurations.setAccessToken === 'function') {
        mp.configurations.setAccessToken(accessToken);
      } else if (typeof mp.setAccessToken === 'function') {
        mp.setAccessToken(accessToken);
      } else {
        // SDK doesn't provide a known configure method; we'll use HTTP API instead
        useSdk = false;
      }
    } catch (e) {
      useSdk = false;
    }

    const preference = {
      items: [
        {
          title: data.descripcion || 'Aporte',
          quantity: 1,
          unit_price: Number(data.monto),
        },
      ],
      back_urls: {
        success: process.env.SITE_URL || 'http://localhost:3000',
        failure: process.env.SITE_URL || 'http://localhost:3000',
        pending: process.env.SITE_URL || 'http://localhost:3000',
      },
      notification_url: `${process.env.SITE_URL || 'http://localhost:3000'}/aportes/webhook/mercadopago`,
    } as any;

    // use the normalized mp from above
    let response: any;
    try {
      if (useSdk) {
        response = await mp.preferences.create(preference);
      } else {
        // Fallback: call Mercado Pago REST API directly
        const fetchFn: any = (globalThis as any).fetch ?? undefined;
        if (!fetchFn) {
          throw new Error('No fetch available to call Mercado Pago API');
        }
        const resp = await fetchFn('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(preference),
        });
        response = await resp.json();
      }
    } catch (err: any) {
      const logger = new Logger('AportesService');
      logger.error('Error creating Mercado Pago preference', err?.message ?? err);
      // include SDK/HTTP error message in HttpException so client can surface it
      throw new HttpException({ message: 'Mercado Pago error creating preference', detail: err?.message ?? err }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // safe-extract ids (SDK may return different shapes)
    const preferenceId = response?.body?.id ?? response?.id;
    const initPoint = response?.body?.init_point ?? response?.init_point;

    // Persist Aporte with pending status and preferenceId
    const aporte = this.aportesRepository.create({
      monto: data.monto,
      preferenceId,
      estado: 'pending',
      creadoEn: new Date(),
    } as Partial<Aporte>);

    const saved = await this.aportesRepository.save(aporte);

    return {
      preferenceId,
      init_point: initPoint,
      savedAporte: saved,
    };
  }

  async handleMercadoPagoNotification(req: any) {
    const accessToken2 = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') ?? process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken2) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured. Set the env var in the same shell where you start the server or add it to backend/.env');
    }
    const mpModule2: any = mercadopago as any;
    const mp2 = mpModule2.default ?? mpModule2;
    let useSdkForWebhook = true;
    try {
      if (typeof mp2.configure === 'function') {
        mp2.configure({ access_token: accessToken2 });
      } else if (mp2.configurations && typeof mp2.configurations.setAccessToken === 'function') {
        mp2.configurations.setAccessToken(accessToken2);
      } else if (typeof mp2.setAccessToken === 'function') {
        mp2.setAccessToken(accessToken2);
      } else {
        useSdkForWebhook = false;
      }
    } catch (e) {
      useSdkForWebhook = false;
    }

    // Mercado Pago sends different shapes: use topic/id or resource
    const body = req.body || {};
    const query = req.query || {};

    const logger = new Logger('AportesService');

    try {
      // If it's a payment notification with type=payment and id
      const mp = mp2;

      if (query.type === 'payment' && query['id']) {
        const paymentId = query['id'];
        let payment: any;
        if (useSdkForWebhook) {
          payment = await mp.payment.findById(paymentId);
        } else {
          const fetchFn: any = (globalThis as any).fetch ?? undefined;
          if (!fetchFn) throw new Error('No fetch available to call Mercado Pago API');
          const resp = await fetchFn(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${accessToken2}` } });
          payment = await resp.json();
        }
        // Update Aporte by matching preference_id or metadata
        const prefId = payment?.body?.preference_id ?? payment?.preference_id ?? payment?.order?.id ?? payment?.body?.order?.id;
        if (prefId) {
          const aporte = await this.aportesRepository.findOne({ where: { preferenceId: prefId } });
          if (aporte) {
            aporte.paymentId = String(paymentId);
            aporte.estado = payment.body.status || 'approved';
            aporte.payerEmail = payment.body.payer?.email;
            aporte.payerName = [payment.body.payer?.first_name, payment.body.payer?.last_name].filter(Boolean).join(' ');
            aporte.pagadoEn = payment.body.date_approved ? new Date(payment.body.date_approved) : new Date();
            await this.aportesRepository.save(aporte);
            return { ok: true };
          }
        }
      }

      // If it's a notification webhook with topic and id
      if (body.type === 'payment' && body.data && body.data.id) {
        const paymentId = body.data.id;
        let payment: any;
        if (useSdkForWebhook) {
          payment = await mp.payment.findById(paymentId);
        } else {
          const fetchFn: any = (globalThis as any).fetch ?? undefined;
          if (!fetchFn) throw new Error('No fetch available to call Mercado Pago API');
          const resp = await fetchFn(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${accessToken2}` } });
          payment = await resp.json();
        }
        const prefId = payment?.body?.preference_id ?? payment?.preference_id ?? payment?.order?.id ?? payment?.body?.order?.id;
        if (prefId) {
          const aporte = await this.aportesRepository.findOne({ where: { preferenceId: prefId } });
          if (aporte) {
            aporte.paymentId = String(paymentId);
            aporte.estado = payment.body.status || 'approved';
            aporte.payerEmail = payment.body.payer?.email;
            aporte.payerName = [payment.body.payer?.first_name, payment.body.payer?.last_name].filter(Boolean).join(' ');
            aporte.pagadoEn = payment.body.date_approved ? new Date(payment.body.date_approved) : new Date();
            await this.aportesRepository.save(aporte);
            return { ok: true };
          }
        }
      }

      // Fallback: acknowledge
      logger.warn('Unhandled mercadopago notification shape', JSON.stringify({ body, query }));
      return { ok: true };
    } catch (err) {
      logger.error('Error handling mercadopago notification', err);
      throw err;
    }
  }

  update(id: number, data: Partial<Aporte>) {
    return this.aportesRepository.update(id, data);
  }

  remove(id: number) {
    return this.aportesRepository.delete(id);
  }
}
