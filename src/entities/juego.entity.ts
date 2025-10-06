import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JuegoUsuario } from './juego-usuario.entity';

@Entity('juegos')
export class Juego {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('text')
  descripcion: string;

  @OneToMany(() => JuegoUsuario, (ju) => ju.juego)
  usuarios: JuegoUsuario[];
}
