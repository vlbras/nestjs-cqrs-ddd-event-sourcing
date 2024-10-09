import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PendingPostData } from '@post/domain/entities';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';

export class PostCreatedEvent {
  public constructor(
    public readonly postId: string,
    public readonly eventData: PendingPostData,
  ) {}
}

@EventsHandler(PostCreatedEvent)
export class PostCreatedEventHandler implements IEventHandler<PostCreatedEvent> {
  public constructor(private readonly postEventRepository: PostEventRepository) {}

  public async handle(event: PostCreatedEvent): Promise<void> {
    await this.postEventRepository.create({
      id: event.postId,
      data: event.eventData,
    });
  }
}
