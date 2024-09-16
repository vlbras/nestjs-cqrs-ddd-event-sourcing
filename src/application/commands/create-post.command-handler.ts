import { PostCreatedEvent } from '@application/events';
import { PendingPostData } from '@domain/entities';
import { PostRepository } from '@infrastructure/repositories/post.repository';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostCommand {
  public constructor(
    public readonly data: {
      title: string;
      content: string;
      authorId: string;
      eventData: PendingPostData;
    },
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler implements ICommandHandler<CreatePostCommand> {
  public constructor(
    private readonly postRepository: PostRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreatePostCommand): Promise<void> {
    const post = await this.postRepository.create(command.data);
    this.eventBus.publish(new PostCreatedEvent(post.id, command.data.eventData));
  }
}
