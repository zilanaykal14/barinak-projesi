import { CipService } from './cip.service';
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';
export declare class CipController {
    private readonly cipService;
    constructor(cipService: CipService);
    create(createCipDto: CreateCipDto): Promise<CreateCipDto & import("./entities/cip.entity").Cip>;
    findAll(): Promise<import("./entities/cip.entity").Cip[]>;
    findOne(id: string): Promise<import("./entities/cip.entity").Cip | null>;
    update(id: string, updateCipDto: UpdateCipDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
