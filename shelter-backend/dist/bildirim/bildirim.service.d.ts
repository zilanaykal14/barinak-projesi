import { Repository } from 'typeorm';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';
import { Bildirim } from './entities/bildirim.entity';
export declare class BildirimService {
    private bildirimRepo;
    constructor(bildirimRepo: Repository<Bildirim>);
    create(createBildirimDto: CreateBildirimDto): Promise<CreateBildirimDto & Bildirim>;
    findAll(): Promise<Bildirim[]>;
    findOne(id: number): Promise<Bildirim | null>;
    update(id: number, updateBildirimDto: UpdateBildirimDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
