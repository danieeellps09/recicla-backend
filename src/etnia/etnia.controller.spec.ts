import { Test, TestingModule } from '@nestjs/testing';
import { EtniaController } from './etnia.controller';

describe('EtniaController', () => {
  let controller: EtniaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtniaController],
    }).compile();

    controller = module.get<EtniaController>(EtniaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
