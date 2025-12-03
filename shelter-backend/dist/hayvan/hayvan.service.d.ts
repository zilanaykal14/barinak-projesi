import { Repository } from 'typeorm';
import { CreateHayvanDto } from './dto/create-hayvan.dto';
import { UpdateHayvanDto } from './dto/update-hayvan.dto';
import { Hayvan } from './entities/hayvan.entity';
export declare class HayvanService {
    private hayvanRepository;
    constructor(hayvanRepository: Repository<Hayvan>);
    create(createHayvanDto: CreateHayvanDto): Promise<CreateHayvanDto & Hayvan>;
    findAll(): Promise<Hayvan[]>;
    findOne(id: number): Promise<Hayvan | null>;
    update(id: number, updateHayvanDto: UpdateHayvanDto): Promise<Hayvan>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
