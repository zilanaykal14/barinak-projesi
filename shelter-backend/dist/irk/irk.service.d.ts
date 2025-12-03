import { Repository } from 'typeorm';
import { CreateIrkDto } from './dto/create-irk.dto';
import { UpdateIrkDto } from './dto/update-irk.dto';
import { Irk } from './entities/irk.entity';
export declare class IrkService {
    private irkRepository;
    constructor(irkRepository: Repository<Irk>);
    create(createIrkDto: CreateIrkDto): Promise<CreateIrkDto & Irk>;
    findAll(): Promise<Irk[]>;
    findOne(id: number): Promise<Irk | null>;
    update(id: number, updateIrkDto: UpdateIrkDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
