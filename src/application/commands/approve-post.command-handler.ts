import { PostStatusUpdatedEvent } from '@application/events';
import { ApprovedPostData, PendingPost } from '@domain/entities';
import { PostEventRepository } from '@infrastructure/repositories/post-event.repository';
import { PostRepository } from '@infrastructure/repositories/post.repository';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

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

  public async execute(command: ApprovePostCommand): Promise<void> {
    const post = await this.postRepository.findEvent<PendingPost>(command.id);
    const approvedPost = post.approve(command.data);

    await this.postEventRepository.create(approvedPost);

    this.eventBus.publish(new PostStatusUpdatedEvent(approvedPost));
  }
}
