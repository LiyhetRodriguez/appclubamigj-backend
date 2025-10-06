import { Test, TestingModule } from '@nestjs/testing';
import { JuegoUsuariosController } from './juego-usuarios.controller';

describe('JuegoUsuariosController', () => {
  let controller: JuegoUsuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JuegoUsuariosController],
    }).compile();

    controller = module.get<JuegoUsuariosController>(JuegoUsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
