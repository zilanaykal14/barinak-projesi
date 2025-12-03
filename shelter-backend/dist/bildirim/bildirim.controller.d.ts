import { BildirimService } from './bildirim.service';
import { CreateBildirimDto } from './dto/create-bildirim.dto';
import { UpdateBildirimDto } from './dto/update-bildirim.dto';
export declare class BildirimController {
    private readonly bildirimService;
    constructor(bildirimService: BildirimService);
    create(createBildirimDto: CreateBildirimDto): Promise<CreateBildirimDto & import("./entities/bildirim.entity").Bildirim>;
    findAll(): Promise<import("./entities/bildirim.entity").Bildirim[]>;
    findOne(id: string): Promise<import("./entities/bildirim.entity").Bildirim | null>;
    update(id: string, updateBildirimDto: UpdateBildirimDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
