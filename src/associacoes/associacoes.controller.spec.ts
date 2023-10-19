import { Test, TestingModule } from '@nestjs/testing';
import { AssociacoesController } from './associacoes.controller';

describe('AssociacoesController', () => {
  let controller: AssociacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociacoesController],
    }).compile();

    controller = module.get<AssociacoesController>(AssociacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
