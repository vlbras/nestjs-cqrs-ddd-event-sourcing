import { Logger, NotFoundException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Post } from '@post/domain/entities';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

export class PostStatusUpdatedEvent {
  public constructor(public readonly postEvent: Post) {}
}

@EventsHandler(PostStatusUpdatedEvent)
export class PostStatusUpdatedEventHandler implements IEventHandler<PostStatusUpdatedEvent> {
  public constructor(private readonly postRepository: PostRepository) {}

  private readonly logger = new Logger(PostStatusUpdatedEventHandler.name);

  public async handle(event: PostStatusUpdatedEvent): Promise<void> {
    this.logger.log(`start handling post status updated event: ${JSON.stringify(event)}`);

    const { id, status, data: eventData } = event.postEvent;
    const post = await this.postRepository.updateOne(id, { status, eventData });

    if (!post) {
      this.logger.error(`Post #${event.postEvent.id} not found`);
      throw new NotFoundException('Post not found');
    }

    this.logger.log(`Finish handling post status updated event: ${JSON.stringify(post)}`);
  }
}
