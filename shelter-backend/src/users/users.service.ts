import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

 
  async create(createUserDto: CreateUserDto) {
    

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);


    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }


  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
  async login(email: string, sifre: string): Promise<User | null> {

    const user = await this.userRepository.findOne({ where: { email } });
    

    if (user && await bcrypt.compare(sifre, user.password)) {

      const { password, ...result } = user; 
      return result as User;
    }
    
   
    return null;
  }
}