import { PostApplicationModule } from '@application/post-application.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostController } from './ui/post.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/ddd-sourcing'), PostApplicationModule],
  controllers: [PostController],
})
export class AppModule {}
