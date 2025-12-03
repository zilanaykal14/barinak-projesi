import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Bunu ekledik
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // <--- User entity'sini çağırdık

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <--- İŞTE BU SATIR EKSİKTİ!
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
