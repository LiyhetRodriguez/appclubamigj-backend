import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from  'src/auth/jwt.strategy' ; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    //  Importa ConfigModule global para leer variables del .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    //  Importa la entidad de Usuario
    TypeOrmModule.forFeature([Usuario]),

    //  Configuración dinámica de JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule], //  Exporta para poder usarlo en otros módulos
})
export class AuthModule {}
