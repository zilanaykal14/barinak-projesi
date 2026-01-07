import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bildirim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tip: string; 

  @Column()
  mesaj: string; 
  gonderenAd: string; 

  @Column({ nullable: true })
  hayvanId: number; 

  @Column({ default: 'Bekliyor' })
  durum: string; 
}