import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
    const existe = await this.usuarioRepo.findOne({ where: { numeroDocumento: data.numeroDocumento } });
    if (existe) throw new UnauthorizedException('Usuario ya registrado');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const nuevoUsuario = this.usuarioRepo.create({
      ...data,
      passwordHash,
      rol: 'usuario', // valor por defecto
    });

    await this.usuarioRepo.save(nuevoUsuario);
    return { message: 'Usuario registrado correctamente', usuario: nuevoUsuario };
  }

  @Post('login')
  async login(@Body() data: any) {
    const { numeroDocumento, password } = data;
    return this.authService.validarUsuario(numeroDocumento, password);
  }
}

