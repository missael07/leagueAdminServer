import { Test, TestingModule } from '@nestjs/testing';
import { RostersController } from './rosters.controller';
import { RostersService } from './rosters.service';

describe('RostersController', () => {
  let controller: RostersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RostersController],
      providers: [RostersService],
    }).compile();

    controller = module.get<RostersController>(RostersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
