import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Irk } from '../../irk/entities/irk.entity';
import { Asi } from '../../asi/entities/asi.entity';
import { Cip } from '../../cip/entities/cip.entity';

@Entity()
export class Hayvan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad: string;

  @Column()
  yas: number;

  @Column()
  cinsiyet: string;

  @Column()
  durum: string;

  @Column({ nullable: true })
  resimUrl: string;

  // 1:N İlişki (Irk)
  @ManyToOne(() => Irk, (irk) => irk.hayvanlar, { onDelete: 'SET NULL' })
  irk: Irk;

  // N:M İlişki (Aşılar)
  @ManyToMany(() => Asi)
  @JoinTable()
  asilar: Asi[];

  // 1:1 İlişki (Mikroçip) - cascade: true sayesinde hayvanla beraber çip de kaydedilir
  @OneToOne(() => Cip, { cascade: true, eager: true })
  @JoinColumn()
  cip: Cip;
}