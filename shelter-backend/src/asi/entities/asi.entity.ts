import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad: string; // Örn: 'Kuduz', 'Karma 1'

  @Column({ nullable: true })
  tur: string; // Örn: 'Viral', 'Bakteriyel'
}