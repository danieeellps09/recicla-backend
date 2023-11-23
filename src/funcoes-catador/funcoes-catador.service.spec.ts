import { Test, TestingModule } from '@nestjs/testing';
import { FuncoesCatadorService } from './funcoes-catador.service';

describe('FuncoesCatadorService', () => {
  let service: FuncoesCatadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuncoesCatadorService],
    }).compile();

    service = module.get<FuncoesCatadorService>(FuncoesCatadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
