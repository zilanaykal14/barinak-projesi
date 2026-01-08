import { Repository } from 'typeorm';
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';
import { Cip } from './entities/cip.entity';
export declare class CipService {
    private cipRepository;
    constructor(cipRepository: Repository<Cip>);
    create(createCipDto: CreateCipDto): Promise<CreateCipDto & Cip>;
    findAll(): Promise<Cip[]>;
    findOne(id: number): Promise<Cip | null>;
    update(id: number, updateCipDto: UpdateCipDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
