import { PostEventModel } from '@domain/models/post.event.model';
import { PostModel } from '@domain/models/post.model';
import { PostEventRepository } from '@infrastructure/repositories/post-event.repository';
import { PostRepository } from '@infrastructure/repositories/post.repository';
import { Injectable } from '@nestjs/common';

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
