import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AportesModule } from './aportes/aportes.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { JuegosModule } from './juegos/juegos.module';
import { Usuario } from './entities/usuario.entity';
import { Aporte } from './entities/aporte.entity';
import { Juego } from './entities/juego.entity';
import { JuegoUsuario } from './entities/juego-usuario.entity';
import { Publicacion } from './entities/publicacion.entity';
import { JuegoUsuariosModule } from './juego-usuarios/juego-usuarios.module';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 habilita .env
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'), 
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Usuario],
      synchronize: true,
      autoLoadEntities: true,
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
