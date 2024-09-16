import { Post } from '@domain/entities';
import { PostRepository } from '@infrastructure/repositories/post.repository';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class PostStatusUpdatedEvent {
  public constructor(public readonly postEvent: Post) {}
}

@EventsHandler(PostStatusUpdatedEvent)
export class PostStatusUpdatedEventHandler implements IEventHandler<PostStatusUpdatedEvent> {
  public constructor(private readonly postRepository: PostRepository) {}

  public async handle(event: PostStatusUpdatedEvent): Promise<void> {
    const { id, status, data: eventData } = event.postEvent;
    await this.postRepository.updateOne(id, { status, eventData });
  }
}
