import { Test, TestingModule } from '@nestjs/testing';
import { IrkService } from './irk.service';

describe('IrkService', () => {
  let service: IrkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IrkService],
    }).compile();

    service = module.get<IrkService>(IrkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
