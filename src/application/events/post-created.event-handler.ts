import { PendingPostData } from '@domain/entities';
import { PostEventRepository } from '@infrastructure/repositories/post-event.repository';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

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
