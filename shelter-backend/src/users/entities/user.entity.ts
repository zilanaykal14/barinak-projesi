
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


export enum UserRole {
  MANAGER = 'manager',
  VOLUNTEER = 'volunteer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ unique: true }) 
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VOLUNTEER, 
  })
  role: UserRole;
}