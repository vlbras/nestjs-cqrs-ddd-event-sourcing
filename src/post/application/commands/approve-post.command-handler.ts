import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PostStatusUpdatedEvent } from '@post/application/events';
import { ApprovedPostData, PendingPost } from '@post/domain/entities';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

export class ApprovePostCommand {
  public constructor(
    public readonly id: string,
    public readonly data: ApprovedPostData,
  ) {}
}

@CommandHandler(ApprovePostCommand)
export class ApprovePostCommandHandler implements ICommandHandler<ApprovePostCommand> {
  public constructor(
    private readonly postEventRepository: PostEventRepository,
    private readonly postRepository: PostRepository,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(ApprovePostCommandHandler.name);

  public async execute(command: ApprovePostCommand): Promise<void> {
    this.logger.log(`Start approving post: ${JSON.stringify(command)}`);

    const post = await this.postRepository.findEvent<PendingPost>(command.id);
    const approvedPost = post.approve(command.data);

    await this.postEventRepository.create(approvedPost);

    this.logger.log(`Post successfully approved: ${JSON.stringify(approvedPost)}`);

    this.eventBus.publish(new PostStatusUpdatedEvent(approvedPost));
  }
}
