import { Test, TestingModule } from '@nestjs/testing';
import { OperadorLogisticoService } from './operador-logistico.service';

describe('OperadorLogisticoService', () => {
  let service: OperadorLogisticoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperadorLogisticoService],
    }).compile();

    service = module.get<OperadorLogisticoService>(OperadorLogisticoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
