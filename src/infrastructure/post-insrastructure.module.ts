import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostEventEntity, PostEventSchema } from './entities/post-event.entity';
import { PostEntity, PostSchema } from './entities/post.entity';
import { PostEventRepository } from './repositories/post-event.repository';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostEntity.name, schema: PostSchema },
      { name: PostEventEntity.name, schema: PostEventSchema },
    ]),
  ],
  providers: [PostRepository, PostEventRepository],
  exports: [PostRepository, PostEventRepository],
})
export class PostInfrastructureModule {}
