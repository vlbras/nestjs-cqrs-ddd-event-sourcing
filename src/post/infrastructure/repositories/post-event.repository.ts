import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostStatuses } from '@post/domain/enums/post-statuses.enum';
import { PostEventModel } from '@post/domain/models/post.event.model';
import { PostEventEntity } from '@post/infrastructure/entities/post-event.entity';
import { PostEventMapper } from '@post/infrastructure/mappers/post.event.mapper';
import { Model } from 'mongoose';

@Injectable()
export class PostEventRepository {
  public constructor(@InjectModel(PostEventEntity.name) private readonly postEvent: Model<PostEventEntity>) {}

  public async findMany(postId: string): Promise<PostEventModel> {
    const events = await this.postEvent.find({ postId }).lean().exec();
    return PostEventMapper.toDomainModel(events);
  }

  public async create(input: { id: string; status?: PostStatuses; data: Record<string, unknown> }): Promise<void> {
    await this.postEvent.create({
      postId: input.id,
      status: input.status ?? PostStatuses.PENDING,
      data: input.data,
    });
  }
}
