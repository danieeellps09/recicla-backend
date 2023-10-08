import { Test, TestingModule } from '@nestjs/testing';
import { CatadorService } from './catador.service';

describe('CatadorService', () => {
  let service: CatadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatadorService],
    }).compile();

    service = module.get<CatadorService>(CatadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
