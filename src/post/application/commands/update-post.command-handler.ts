import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';

export class UpdatePostCommand {
  public constructor(
    public readonly id: string,
    public readonly data: {
      title: string;
      content: string;
    },
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler implements ICommandHandler<UpdatePostCommand> {
  public constructor(private readonly postRepository: PostRepository) {}

  private readonly logger = new Logger(UpdatePostCommandHandler.name);

  public async execute(command: UpdatePostCommand): Promise<void> {
    this.logger.log(`Start updating post: ${JSON.stringify(command)}`);

    const post = await this.postRepository.updateOne(command.id, command.data);

    if (!post) {
      this.logger.error(`Post #${command.id} not found`);
      throw new NotFoundException('Post not found');
    }

    this.logger.log(`Post successfully updated: ${JSON.stringify(post)}`);
  }
}
