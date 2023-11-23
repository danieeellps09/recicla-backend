import { Test, TestingModule } from '@nestjs/testing';
import { FuncoesCatadorController } from './funcoes-catador.controller';

describe('FuncoesCatadorController', () => {
  let controller: FuncoesCatadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuncoesCatadorController],
    }).compile();

    controller = module.get<FuncoesCatadorController>(FuncoesCatadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
