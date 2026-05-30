import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsuariosModule } from './usuarios/usuarios.module';
import { AportesModule } from './aportes/aportes.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { JuegosModule } from './juegos/juegos.module';
import { JuegoUsuariosModule } from './juego-usuarios/juego-usuarios.module';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    ssl: {
  rejectUnauthorized: false,
},
    }),

    UsuariosModule,
    AportesModule,
    PublicacionesModule,
    JuegosModule,
    JuegoUsuariosModule,
    AuthModule,
    BannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}