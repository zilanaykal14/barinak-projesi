import { CipService } from './cip.service';
import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';
export declare class CipController {
    private readonly cipService;
    constructor(cipService: CipService);
    create(createCipDto: CreateCipDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCipDto: UpdateCipDto): string;
    remove(id: string): string;
}
