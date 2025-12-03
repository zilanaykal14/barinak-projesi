import { Test, TestingModule } from '@nestjs/testing';
import { AsiService } from './asi.service';

describe('AsiService', () => {
  let service: AsiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsiService],
    }).compile();

    service = module.get<AsiService>(AsiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
