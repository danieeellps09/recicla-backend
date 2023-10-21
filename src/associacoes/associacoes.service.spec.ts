import { Test, TestingModule } from '@nestjs/testing';
import { AssociacoesService } from './associacoes.service';

describe('AssociacoesService', () => {
  let service: AssociacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssociacoesService],
    }).compile();

    service = module.get<AssociacoesService>(AssociacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
