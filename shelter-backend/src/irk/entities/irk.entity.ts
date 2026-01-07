import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Hayvan } from '../../hayvan/entities/hayvan.entity'; 

@Entity()
export class Irk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad: string;

  @Column({ nullable: true })
  aciklama: string;

 
  @OneToMany(() => Hayvan, (hayvan) => hayvan.irk)
  hayvanlar: Hayvan[];
}