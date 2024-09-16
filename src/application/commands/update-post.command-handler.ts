import { PostRepository } from '@infrastructure/repositories/post.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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

  public async execute(command: UpdatePostCommand): Promise<void> {
    await this.postRepository.updateOne(command.id, command.data);
  }
}
