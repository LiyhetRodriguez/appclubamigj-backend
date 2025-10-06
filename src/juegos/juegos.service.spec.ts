import { Test, TestingModule } from '@nestjs/testing';
import { JuegosService } from './juegos.service';

describe('JuegosService', () => {
  let service: JuegosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JuegosService],
    }).compile();

    service = module.get<JuegosService>(JuegosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
