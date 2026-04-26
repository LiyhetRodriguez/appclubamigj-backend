import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    console.log('🔥 AUTH SIN CREACIÓN AUTOMÁTICA DE ADMIN');
  }

  async validarUsuario(numeroDocumento: string, password: string) {
    if (!numeroDocumento || !password) {
      throw new BadRequestException('Documento y contraseña son obligatorios.');
    }

    const usuario = await this.usuarioRepo.findOne({
      where: { numeroDocumento: numeroDocumento.toString().trim() },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    const esValido = await bcrypt.compare(
      password,
      usuario.passwordHash,
    );

    if (!esValido) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    const payload = { sub: usuario.id, rol: usuario.rol };
    const token = await this.jwtService.signAsync(payload);

    const { passwordHash, ...datosUsuario } = usuario;

    return {
      token,
      usuario: datosUsuario,
    };
  }

  async registrarUsuario(data: any) {
    const numeroDocumento = (
      data.numeroDocumento ||
      data.numero_documento ||
      data.documento ||
      ''
    ).toString().trim();

    const password = (
      data.password ||
      data.passwordHash ||
      data.contrasena ||
      ''
    ).toString().trim();

    if (!numeroDocumento || !password) {
      throw new BadRequestException('Documento y contraseña son obligatorios.');
    }

    const existe = await this.usuarioRepo.findOne({
      where: { numeroDocumento },
    });

    if (existe) {
      throw new BadRequestException('El número de documento ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      ...data,
      numeroDocumento,
      passwordHash,
      rol: data.rol || 'usuario',
    }) as any;

    const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioSeguro } = usuarioGuardado as any;

    return usuarioSeguro;
  }
}