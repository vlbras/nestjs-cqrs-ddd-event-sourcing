import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@post/domain/entities';
import { PostStatuses } from '@post/domain/enums/post-statuses.enum';
import { PostModel } from '@post/domain/models/post.model';
import { PostEntity } from '@post/infrastructure/entities/post.entity';
import { PostEventMapper } from '@post/infrastructure/mappers/post.event.mapper';
import { PostMapper } from '@post/infrastructure/mappers/post.mapper';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostRepository {
  public constructor(@InjectModel(PostEntity.name) private readonly post: Model<PostEntity>) {}

  public async create(input: {
    title: string;
    content: string;
    authorId: string;
    eventData: Record<string, unknown>;
  }): Promise<PostModel> {
    const post = await this.post.create(input);
    return PostMapper.toDomainModel(post);
  }

  public async findOne(input: { id: string; status?: PostStatuses }): Promise<PostModel> {
    const filter: Partial<PostEntity> = { _id: new Types.ObjectId(input.id) };

    if (input.status) {
      filter.status = input.status;
    }

    const post = await this.post.findOne(filter).lean().exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostMapper.toDomainModel(post);
  }

  public async findMany(): Promise<PostModel[]> {
    const posts = await this.post.find().lean().exec();
    return posts.map(PostMapper.toDomainModel);
  }

  public async findEvent<T extends Post>(id: string): Promise<T> {
    const post = await this.findOne({ id });
    return PostEventMapper.toDomainEntity(post) as T;
  }

  public async updateOne(
    id: string,
    data: {
      title?: string;
      content?: string;
      status?: PostStatuses;
      eventData?: Record<string, unknown>;
    },
  ): Promise<PostModel | null> {
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No data provided');
    }

    const post = await this.post
      .findOneAndUpdate({ _id: new Types.ObjectId(id) }, data, { lean: true, new: true })
      .exec();

    return post ? PostMapper.toDomainModel(post) : null;
  }
}
