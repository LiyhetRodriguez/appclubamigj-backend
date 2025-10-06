import { Test, TestingModule } from '@nestjs/testing';
import { JuegosController } from './juegos.controller';

describe('JuegosController', () => {
  let controller: JuegosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JuegosController],
    }).compile();

    controller = module.get<JuegosController>(JuegosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
