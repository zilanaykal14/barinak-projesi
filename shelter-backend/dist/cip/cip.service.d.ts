import { CreateCipDto } from './dto/create-cip.dto';
import { UpdateCipDto } from './dto/update-cip.dto';
export declare class CipService {
    create(createCipDto: CreateCipDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCipDto: UpdateCipDto): string;
    remove(id: number): string;
}
