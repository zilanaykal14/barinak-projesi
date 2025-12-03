import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Hayvan } from '../../hayvan/entities/hayvan.entity'; // Hayvan'ı çağırdık

@Entity()
export class Irk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad: string;

  @Column({ nullable: true })
  aciklama: string;

  // İLİŞKİ (1 Irk -> N Hayvan)
  @OneToMany(() => Hayvan, (hayvan) => hayvan.irk)
  hayvanlar: Hayvan[];
}