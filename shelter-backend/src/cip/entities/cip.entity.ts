import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Hayvan } from '../../hayvan/entities/hayvan.entity';

@Entity()
export class Cip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) 
  numara: string;

  
  @OneToOne(() => Hayvan, (hayvan) => hayvan.cip)
  hayvan: Hayvan;
}