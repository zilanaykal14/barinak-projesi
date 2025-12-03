import { Test, TestingModule } from '@nestjs/testing';
import { BildirimService } from './bildirim.service';

describe('BildirimService', () => {
  let service: BildirimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BildirimService],
    }).compile();

    service = module.get<BildirimService>(BildirimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
