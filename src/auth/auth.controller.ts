import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
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
      throw new UnauthorizedException('Usuario ya registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepo.create({
  ...data,
  numeroDocumento,
  passwordHash,
  rol: data.rol || 'usuario',
}) as any;

    const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioSeguro } = usuarioGuardado;

    return {
      message: 'Usuario registrado correctamente',
      usuario: usuarioSeguro,
    };
  }

  @Post('login')
  async login(@Body() data: any) {
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

    return this.authService.validarUsuario(numeroDocumento, password);
  }
}