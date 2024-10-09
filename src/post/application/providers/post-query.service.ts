import { Injectable } from '@nestjs/common';
import { PostEventModel } from '@post/domain/models/post.event.model';
import { PostModel } from '@post/domain/models/post.model';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

@Injectable()
export class PostQueryService {
  public constructor(
    private readonly postRepository: PostRepository,
    private readonly postEventRepository: PostEventRepository,
  ) {}

  public async getPosts(): Promise<PostModel[]> {
    return this.postRepository.findMany();
  }

  public async getPost(id: string): Promise<PostModel> {
    return this.postRepository.findOne({ id });
  }

  public async getPostEvents(postId: string): Promise<PostEventModel> {
    return this.postEventRepository.findMany(postId);
  }
}
