import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bildirim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tip: string; // 'ihbar' veya 'sahiplenme'

  @Column()
  mesaj: string; // "X sokakta yaralı kedi" veya "Pamuk isimli kediyi istiyorum"

  @Column()
  gonderenAd: string; // Kim gönderdi?

  @Column({ nullable: true })
  hayvanId: number; // Sahiplenme ise hangi hayvan? (Yoksa boş)

  @Column({ default: 'Bekliyor' })
  durum: string; // 'Bekliyor', 'Onaylandı'
}