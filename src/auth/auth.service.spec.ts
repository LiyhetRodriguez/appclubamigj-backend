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
    console.log('🔥 AUTH LIMPIO SIN CREAR ADMIN AUTOMÁTICO');
  }

  async validarUsuario(numeroDocumento: string, password: string) {
    if (!numeroDocumento || !password) {
      throw new BadRequestException('Documento y contraseña son obligatorios.');
    }

    const usuario = await this.usuarioRepo.findOne({
      where: {
        numeroDocumento: numeroDocumento.toString().trim(),
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    let esValido = false;

    if (
      usuario.passwordHash.startsWith('$2a$') ||
      usuario.passwordHash.startsWith('$2b$') ||
      usuario.passwordHash.startsWith('$2y$')
    ) {
      esValido = await bcrypt.compare(password, usuario.passwordHash);
    } else {
      esValido =
        usuario.passwordHash.toString().trim() ===
        password.toString().trim();
    }

    if (!esValido) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    const payload = {
      sub: usuario.id,
      rol: usuario.rol,
    };

    const token = await this.jwtService.signAsync(payload);

    const { passwordHash, ...datosUsuario } = usuario;

    return {
      token,
      usuario: datosUsuario,
    };
  }

  async registrarUsuario(data: Partial<Usuario>) {
    const { numeroDocumento, passwordHash } = data;

    if (!numeroDocumento || !passwordHash) {
      throw new BadRequestException('Faltan campos obligatorios.');
    }

    const existe = await this.usuarioRepo.findOne({
      where: {
        numeroDocumento: numeroDocumento.toString().trim(),
      },
    });

    if (existe) {
      throw new BadRequestException('El número de documento ya está registrado.');
    }

    const passwordEncriptada = await bcrypt.hash(passwordHash, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      ...data,
      numeroDocumento: numeroDocumento.toString().trim(),
      passwordHash: passwordEncriptada,
      rol: 'usuario',
    });

    await this.usuarioRepo.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioSeguro } = nuevoUsuario;

    return usuarioSeguro;
  }
}