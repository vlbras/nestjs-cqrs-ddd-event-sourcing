import { PostModel } from '@post/domain/models/post.model';
import { PostEntity } from '@post/infrastructure/entities/post.entity';

export class PostMapper {
  public static toDomainModel(entity: PostEntity): PostModel {
    return {
      id: entity._id.toString(),
      title: entity.title,
      content: entity.content,
      status: entity.status,
      authorId: entity.authorId,
      eventData: entity.eventData,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
