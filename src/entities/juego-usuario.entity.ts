import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Juego } from './juego.entity';

@Entity('juego_usuarios')
export class JuegoUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.juegosUsuario)
  usuario: Usuario;

  @ManyToOne(() => Juego, (juego) => juego.usuarios)
  juego: Juego;

  @Column()
  puntaje: number;

  @Column({ type: 'timestamp' })
  fecha: Date;
}
