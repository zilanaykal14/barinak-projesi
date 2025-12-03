import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Hayvan } from '../../hayvan/entities/hayvan.entity';

@Entity()
export class Cip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Her çip numarası benzersiz olmalı
  numara: string;

  // Çipin bağlı olduğu hayvan (Tersten erişim için)
  @OneToOne(() => Hayvan, (hayvan) => hayvan.cip)
  hayvan: Hayvan;
}