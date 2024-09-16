import { ApprovePostCommand, CreatePostCommand, RejectPostCommand, UpdatePostCommand } from '@application/commands';
import { PostCommandFacade } from '@application/providers/post-command.facade';
import { PostQueryService } from '@application/providers/post-query.service';
import { PostEventModel } from '@domain/models/post.event.model';
import { PostModel } from '@domain/models/post.model';
import { Controller, Get, Patch, Post } from '@nestjs/common';

import { ApprovePostDto, CreatePostDto, RejectPostDto, UpdatePostDto } from './dto';

@Controller('post')
export class PostController {
  public constructor(
    private readonly postCommandFacade: PostCommandFacade,
    private readonly postQueryService: PostQueryService,
  ) {}

  @Get()
  public async getPosts(): Promise<PostModel[]> {
    return this.postQueryService.getPosts();
  }

  @Get(':id')
  public async getPost(id: string): Promise<PostModel> {
    return this.postQueryService.getPost(id);
  }

  @Post()
  public async createPost(dto: CreatePostDto): Promise<void> {
    const { priority, authorReputation } = dto;
    const command = new CreatePostCommand({ ...dto, eventData: { priority, authorReputation } });
    this.postCommandFacade.createPost(command);
  }

  @Patch(':id')
  public async updatePost(id: string, dto: UpdatePostDto): Promise<void> {
    const command = new UpdatePostCommand(id, dto);
    this.postCommandFacade.updatePost(command);
  }

  @Get(':id/events')
  public async getPostEvents(id: string): Promise<PostEventModel> {
    return this.postQueryService.getPostEvents(id);
  }

  @Patch(':id/approve')
  public async approvePost(id: string, dto: ApprovePostDto): Promise<void> {
    const command = new ApprovePostCommand(id, dto);
    this.postCommandFacade.approvePost(command);
  }

  @Patch(':id/reject')
  public async rejectPost(id: string, dto: RejectPostDto): Promise<void> {
    const command = new RejectPostCommand(id, dto);
    this.postCommandFacade.rejectPost(command);
  }
}
