import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerSchema } from './worker.model';
//import { WorkerController } from './worker.controller';
//import { WorkerService } from './worker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkerModule.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class WorkerModule {}
