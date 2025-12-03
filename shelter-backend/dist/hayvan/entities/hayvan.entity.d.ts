import { Irk } from '../../irk/entities/irk.entity';
import { Asi } from '../../asi/entities/asi.entity';
import { Cip } from '../../cip/entities/cip.entity';
export declare class Hayvan {
    id: number;
    ad: string;
    yas: number;
    cinsiyet: string;
    durum: string;
    resimUrl: string;
    irk: Irk;
    asilar: Asi[];
    cip: Cip;
}
