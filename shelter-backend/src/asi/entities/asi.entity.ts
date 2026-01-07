import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad: string; 

  @Column({ nullable: true })
  tur: string; 
}