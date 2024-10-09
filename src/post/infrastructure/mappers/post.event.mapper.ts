import { UnprocessableEntityException } from '@nestjs/common';
import {
  ApprovedPost,
  ApprovedPostData,
  PendingPost,
  PendingPostData,
  Post,
  RejectedPost,
  RejectedPostData,
} from '@post/domain/entities';
import { PostStatuses } from '@post/domain/enums/post-statuses.enum';
import { PostEventModel } from '@post/domain/models/post.event.model';
import { PostModel } from '@post/domain/models/post.model';
import { PostEventEntity } from '@post/infrastructure/entities/post-event.entity';

export class PostEventMapper {
  public static toDomainModel(entities: PostEventEntity[]): PostEventModel {
    const model: Partial<PostEventModel> = {
      postId: entities[0].postId,
    };

    entities.forEach(entity => {
      model[entity.status] = {
        ...entity.data,
        [entity.status + 'At']: entity.createdAt.toISOString(),
      };
    });

    return model as PostEventModel;
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
