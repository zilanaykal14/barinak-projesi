import { AsiService } from './asi.service';
import { CreateAsiDto } from './dto/create-asi.dto';
import { UpdateAsiDto } from './dto/update-asi.dto';
export declare class AsiController {
    private readonly asiService;
    constructor(asiService: AsiService);
    create(createAsiDto: CreateAsiDto): Promise<CreateAsiDto & import("./entities/asi.entity").Asi>;
    findAll(): Promise<import("./entities/asi.entity").Asi[]>;
    findOne(id: string): Promise<import("./entities/asi.entity").Asi | null>;
    update(id: string, updateAsiDto: UpdateAsiDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
