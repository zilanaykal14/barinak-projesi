import { Test, TestingModule } from '@nestjs/testing';
import { IrkController } from './irk.controller';
import { IrkService } from './irk.service';

describe('IrkController', () => {
  let controller: IrkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IrkController],
      providers: [IrkService],
    }).compile();

    controller = module.get<IrkController>(IrkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
