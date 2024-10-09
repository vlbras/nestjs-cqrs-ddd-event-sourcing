import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApprovePostCommand,
  CreatePostCommand,
  RejectPostCommand,
  UpdatePostCommand,
} from '@post/application/commands';
import { PostCommandFacade } from '@post/application/providers/post-command.facade';
import { PostQueryService } from '@post/application/providers/post-query.service';
import { PostEventModel } from '@post/domain/models/post.event.model';
import { PostModel } from '@post/domain/models/post.model';
import { IsObjectIdPipe } from 'nestjs-object-id';

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
  public async getPost(@Param('id', IsObjectIdPipe) id: string): Promise<PostModel> {
    return this.postQueryService.getPost(id);
  }

  @Post()
  public async createPost(@Body() dto: CreatePostDto): Promise<void> {
    const { priority, authorReputation } = dto;
    const command = new CreatePostCommand({ ...dto, eventData: { priority, authorReputation } });
    this.postCommandFacade.createPost(command);
  }

  @Patch(':id')
  public async updatePost(@Param('id', IsObjectIdPipe) id: string, @Body() dto: UpdatePostDto): Promise<void> {
    const command = new UpdatePostCommand(id, dto);
    this.postCommandFacade.updatePost(command);
  }

  @Get(':id/events')
  public async getPostEvents(@Param('id', IsObjectIdPipe) id: string): Promise<PostEventModel> {
    return this.postQueryService.getPostEvents(id);
  }

  @Patch(':id/approve')
  public async approvePost(@Param('id', IsObjectIdPipe) id: string, @Body() dto: ApprovePostDto): Promise<void> {
    const command = new ApprovePostCommand(id, dto);
    this.postCommandFacade.approvePost(command);
  }

  @Patch(':id/reject')
  public async rejectPost(@Param('id', IsObjectIdPipe) id: string, @Body() dto: RejectPostDto): Promise<void> {
    const command = new RejectPostCommand(id, dto);
    this.postCommandFacade.rejectPost(command);
  }
}
