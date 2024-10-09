import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthorReputations, PostPriorities, PostStatuses } from '@post/domain/enums';
import { PostEntity } from '@post/infrastructure/entities/post.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostFixture {
  public constructor(
    @InjectModel(PostEntity.name)
    private readonly postModel: Model<PostEntity>,
  ) {}

  public async createPost(override?: Partial<PostEntity>): Promise<PostEntity> {
    return this.postModel.create({
      _id: new Types.ObjectId(),
      title: 'title',
      content: 'content',
      status: PostStatuses.PENDING,
      eventData: {
        priority: PostPriorities.HIGH,
        authorReputation: AuthorReputations.EXPERT,
      },
      authorId: new Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    });
  }

  public async deleteAll(): Promise<void> {
    await this.postModel.deleteMany({});
  }
}
