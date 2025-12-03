import { IrkService } from './irk.service';
import { CreateIrkDto } from './dto/create-irk.dto';
import { UpdateIrkDto } from './dto/update-irk.dto';
export declare class IrkController {
    private readonly irkService;
    constructor(irkService: IrkService);
    create(createIrkDto: CreateIrkDto): Promise<CreateIrkDto & import("./entities/irk.entity").Irk>;
    findAll(): Promise<import("./entities/irk.entity").Irk[]>;
    findOne(id: string): Promise<import("./entities/irk.entity").Irk | null>;
    update(id: string, updateIrkDto: UpdateIrkDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
