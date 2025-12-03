import { HayvanService } from './hayvan.service';
import { CreateHayvanDto } from './dto/create-hayvan.dto';
import { UpdateHayvanDto } from './dto/update-hayvan.dto';
export declare class HayvanController {
    private readonly hayvanService;
    constructor(hayvanService: HayvanService);
    create(createHayvanDto: CreateHayvanDto): Promise<CreateHayvanDto & import("./entities/hayvan.entity").Hayvan>;
    findAll(): Promise<import("./entities/hayvan.entity").Hayvan[]>;
    findOne(id: string): Promise<import("./entities/hayvan.entity").Hayvan | null>;
    update(id: string, updateHayvanDto: UpdateHayvanDto): Promise<import("./entities/hayvan.entity").Hayvan>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
