import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PostStatusUpdatedEvent } from '@post/application/events';
import { RejectedPostData, ApprovedPost, PendingPost } from '@post/domain/entities';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

export class RejectPostCommand {
  public constructor(
    public readonly postId: string,
    public readonly data: RejectedPostData,
  ) {}
}

@CommandHandler(RejectPostCommand)
export class RejectPostCommandHandler implements ICommandHandler<RejectPostCommand> {
  public constructor(
    private readonly postEventRepository: PostEventRepository,
    private readonly postRepository: PostRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: RejectPostCommand): Promise<void> {
    const post = await this.postRepository.findEvent<PendingPost | ApprovedPost>(command.postId);
    const rejectedPost = post.reject(command.data);

    await this.postEventRepository.create(rejectedPost);

    this.eventBus.publish(new PostStatusUpdatedEvent(rejectedPost));
  }
}
