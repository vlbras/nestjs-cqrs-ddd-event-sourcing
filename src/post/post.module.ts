import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostApplicationModule } from '@post/application/post-application.module';

import { PostController } from './ui/post.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/ddd-sourcing'), PostApplicationModule],
  controllers: [PostController],
})
export class PostModule {}
