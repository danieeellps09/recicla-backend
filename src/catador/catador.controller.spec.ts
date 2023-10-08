import { Test, TestingModule } from '@nestjs/testing';
import { CatadorController } from './catador.controller';

describe('CatadorController', () => {
  let controller: CatadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatadorController],
    }).compile();

    controller = module.get<CatadorController>(CatadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
