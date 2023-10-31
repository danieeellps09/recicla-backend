import { Test, TestingModule } from '@nestjs/testing';
import { EtniaService } from './etnia.service';

describe('EtniaService', () => {
  let service: EtniaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtniaService],
    }).compile();

    service = module.get<EtniaService>(EtniaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
