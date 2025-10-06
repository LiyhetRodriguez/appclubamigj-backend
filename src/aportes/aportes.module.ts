import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AportesController } from './aportes.controller';
import { AportesService } from './aportes.service';
import { Aporte } from 'src/entities/aporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aporte])],
  controllers: [AportesController],
  providers: [AportesService],
  exports: [AportesService],
})
export class AportesModule {}
