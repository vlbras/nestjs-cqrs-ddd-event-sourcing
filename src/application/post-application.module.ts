import { PostInfrastructureModule } from '@infrastructure/post-insrastructure.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  ApprovePostCommandHandler,
  CreatePostCommandHandler,
  RejectPostCommandHandler,
  UpdatePostCommandHandler,
} from './commands';
import { PostCreatedEventHandler, PostStatusUpdatedEventHandler } from './events';
import { PostCommandFacade } from './providers/post-command.facade';
import { PostQueryService } from './providers/post-query.service';

@Module({
  imports: [CqrsModule.forRoot(), PostInfrastructureModule],
  providers: [
    /* providers */
    PostCommandFacade,
    PostQueryService,

    /* command handlers */
    ApprovePostCommandHandler,
    RejectPostCommandHandler,
    CreatePostCommandHandler,
    UpdatePostCommandHandler,

    /* event handlers */
    PostStatusUpdatedEventHandler,
    PostCreatedEventHandler,
  ],
  exports: [PostCommandFacade, PostQueryService],
})
export class PostApplicationModule {}
