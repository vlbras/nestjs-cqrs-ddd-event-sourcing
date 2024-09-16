import {
  ApprovedPost,
  ApprovedPostData,
  PendingPost,
  PendingPostData,
  Post,
  RejectedPost,
  RejectedPostData,
} from '@domain/entities';
import { PostStatuses } from '@domain/enums/post-statuses.enum';
import { PostEventModel } from '@domain/models/post.event.model';
import { PostModel } from '@domain/models/post.model';
import { PostEventEntity } from '@infrastructure/entities/post-event.entity';
import { UnprocessableEntityException } from '@nestjs/common';

export class PostEventMapper {
  public static toDomainModel(entities: PostEventEntity[]): PostEventModel {
    const model: PostEventModel = {
      postId: entities[0].postId,
      [PostStatuses.PENDING]: {},
      [PostStatuses.APPROVED]: {},
      [PostStatuses.REJECTED]: {},
    };

    entities.forEach(entity => {
      model[entity.status] = entity.data;
    });

    return model;
  }

  public static toDomainEntity(model: PostModel): Post {
    switch (model.status) {
      case PostStatuses.PENDING:
        return new PendingPost(model.id, model.eventData as PendingPostData);
      case PostStatuses.APPROVED:
        return new ApprovedPost(model.id, model.eventData as ApprovedPostData);
      case PostStatuses.REJECTED:
        return new RejectedPost(model.id, model.eventData as RejectedPostData);
      default:
        throw new UnprocessableEntityException(`Post with status ${model.status} cannot be mapped`);
    }
  }
}
