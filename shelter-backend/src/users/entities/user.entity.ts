
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Kullanıcı rollerini tanımlıyoruz (Enum yapısı)
export enum UserRole {
  MANAGER = 'manager',
  VOLUNTEER = 'volunteer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Otomatik artan numara (1, 2, 3...)

  @Column({ unique: true }) // Aynı mailden iki tane olamaz
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VOLUNTEER, // Varsayılan rol Gönüllü olsun
  })
  role: UserRole;
}