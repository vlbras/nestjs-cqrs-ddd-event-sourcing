import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PostCreatedEvent } from '@post/application/events';
import { PendingPostData } from '@post/domain/entities';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

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

  private readonly logger = new Logger(CreatePostCommandHandler.name);

  public async execute(command: CreatePostCommand): Promise<void> {
    this.logger.log(`Start creating post: ${JSON.stringify(command)}`);

    const post = await this.postRepository.create(command.data);

    this.logger.log(`Post successfully created: ${JSON.stringify(post)}`);

    this.eventBus.publish(new PostCreatedEvent(post.id, command.data.eventData));
  }
}
