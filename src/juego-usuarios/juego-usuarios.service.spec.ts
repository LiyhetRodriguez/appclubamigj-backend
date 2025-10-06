import { Test, TestingModule } from '@nestjs/testing';
import { JuegoUsuariosService } from './juego-usuarios.service';

describe('JuegoUsuariosService', () => {
  let service: JuegoUsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JuegoUsuariosService],
    }).compile();

    service = module.get<JuegoUsuariosService>(JuegoUsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
