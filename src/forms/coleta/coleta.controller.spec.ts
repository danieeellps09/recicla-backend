import { Test, TestingModule } from '@nestjs/testing';
import { ColetaController } from './coleta.controller';

describe('ColetaController', () => {
  let controller: ColetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColetaController],
    }).compile();

    controller = module.get<ColetaController>(ColetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
