import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { PostStatuses } from '@post/domain/enums/post-statuses.enum';

import { ApprovedPostData } from './approved-post.domain-entity';
import { RejectedPostData } from './rejected-post.domain-entity';

export class Post<T extends Record<string, unknown> = Record<string, unknown>> {
  public constructor(
    public readonly id: string,
    public readonly status: PostStatuses,
    public readonly data: T,
  ) {}

  private readonly logger = new Logger(Post.name);

  public approve(_: ApprovedPostData): void {
    this.logger.error(`Post with status ${this.status} cannot be approved: ${_}`);
    throw new UnprocessableEntityException(`Post with status ${this.status} cannot be approved`);
  }

  public reject(_: RejectedPostData): void {
    this.logger.error(`Post with status ${this.status} cannot be rejected: ${_}`);
    throw new UnprocessableEntityException(`Post with status ${this.status} cannot be rejected`);
  }
}
