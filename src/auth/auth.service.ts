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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ✅ Crear admin automáticamente si no existe
  async onModuleInit() {
    const adminDocumento = this.configService.get<string>('ADMIN_DOCUMENTO');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminDocumento || !adminPassword) {
      console.warn('⚠️ Variables ADMIN_DOCUMENTO o ADMIN_PASSWORD no configuradas en .env');
      return;
    }

    const adminExistente = await this.usuarioRepo.findOne({
      where: { numeroDocumento: adminDocumento },
    });

    if (!adminExistente) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const nuevoAdmin = this.usuarioRepo.create({
        nombreCompleto: 'Administrador General',
        tipoDocumento: 'CC',
        numeroDocumento: adminDocumento,
        fechaNacimiento: new Date('1990-01-01'), // ✅ Soluciona el error del campo requerido
        passwordHash,
        celular: '0000000000',
        direccion: 'No aplica',
        barrio: 'Centro',
        parroquia: 'Principal',
        email: 'admin@clubamgj.com',
        rol: 'admin',
      });
      await this.usuarioRepo.save(nuevoAdmin);
      console.log('✅ Usuario administrador creado automáticamente.');
    }
  }

  // ✅ Validar usuario al iniciar sesión
  async validarUsuario(numeroDocumento: string, password: string) {
    if (!numeroDocumento || !password) {
      throw new BadRequestException('Documento y contraseña son obligatorios.');
    }

    const usuario = await this.usuarioRepo.findOne({
      where: { numeroDocumento },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    const esValido = await bcrypt.compare(password, usuario.passwordHash);
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

  // ✅ Registrar nuevo usuario (solo usuarios normales)
  async registrarUsuario(data: Partial<Usuario>) {
    const { numeroDocumento, passwordHash } = data;

    if (!numeroDocumento || !passwordHash) {
      throw new BadRequestException('Faltan campos obligatorios.');
    }

    const existe = await this.usuarioRepo.findOne({
      where: { numeroDocumento },
    });

    if (existe) {
      throw new BadRequestException('El número de documento ya está registrado.');
    }

    const password = await bcrypt.hash(passwordHash, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      ...data,
      passwordHash: password,
      rol: 'usuario', // 👤 rol por defecto
    });

    await this.usuarioRepo.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioSeguro } = nuevoUsuario;
    return usuarioSeguro;
  }
}
