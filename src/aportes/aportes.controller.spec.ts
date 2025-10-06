import { Test, TestingModule } from '@nestjs/testing';
import { AportesController } from './aportes.controller';

describe('AportesController', () => {
  let controller: AportesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AportesController],
    }).compile();

    controller = module.get<AportesController>(AportesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
