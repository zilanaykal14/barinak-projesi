import { Test, TestingModule } from '@nestjs/testing';
import { HayvanService } from './hayvan.service';

describe('HayvanService', () => {
  let service: HayvanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HayvanService],
    }).compile();

    service = module.get<HayvanService>(HayvanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
