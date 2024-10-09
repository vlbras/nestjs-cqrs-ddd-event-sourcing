import { Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(PostCreatedEventHandler.name);

  public async handle(event: PostCreatedEvent): Promise<void> {
    this.logger.log(`start handling post created event: ${JSON.stringify(event)}`);

    await this.postEventRepository.create({
      id: event.postId,
      data: event.eventData,
    });

    this.logger.log(`Finish handling post created event: ${JSON.stringify(event)}`);
  }
}
