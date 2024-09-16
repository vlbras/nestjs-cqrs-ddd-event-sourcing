import { ApprovePostCommand, CreatePostCommand, RejectPostCommand, UpdatePostCommand } from '@application/commands';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class PostCommandFacade {
  public constructor(private readonly commandBus: CommandBus) {}

  public async createPost(command: CreatePostCommand): Promise<void> {
    await this.commandBus.execute(command);
  }

  public async updatePost(command: UpdatePostCommand): Promise<void> {
    await this.commandBus.execute(command);
  }

  public async approvePost(command: ApprovePostCommand): Promise<void> {
    await this.commandBus.execute(command);
  }

  public async rejectPost(command: RejectPostCommand): Promise<void> {
    await this.commandBus.execute(command);
  }
}
