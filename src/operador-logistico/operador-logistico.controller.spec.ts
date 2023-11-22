import { Test, TestingModule } from '@nestjs/testing';
import { OperadorLogisticoController } from './operador-logistico.controller';

describe('OperadorLogisticoController', () => {
  let controller: OperadorLogisticoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperadorLogisticoController],
    }).compile();

    controller = module.get<OperadorLogisticoController>(OperadorLogisticoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
