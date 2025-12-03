import { Repository } from 'typeorm';
import { CreateAsiDto } from './dto/create-asi.dto';
import { UpdateAsiDto } from './dto/update-asi.dto';
import { Asi } from './entities/asi.entity';
export declare class AsiService {
    private asiRepository;
    constructor(asiRepository: Repository<Asi>);
    create(createAsiDto: CreateAsiDto): Promise<CreateAsiDto & Asi>;
    findAll(): Promise<Asi[]>;
    findOne(id: number): Promise<Asi | null>;
    update(id: number, updateAsiDto: UpdateAsiDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
