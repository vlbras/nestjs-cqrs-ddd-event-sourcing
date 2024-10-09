import { PostStatuses } from '@post/domain/enums/post-statuses.enum';

import { ApprovePostError, RejectPostError } from '../errors';
import { ApprovedPostData } from './approved-post.domain-entity';
import { RejectedPostData } from './rejected-post.domain-entity';

export class Post<T extends Record<string, unknown> = Record<string, unknown>> {
  public constructor(
    public readonly id: string,
    public readonly status: PostStatuses,
    public readonly data: T,
  ) {}

  public approve(_: ApprovedPostData): void {
    throw new ApprovePostError(this.id, this.status);
  }

  public reject(_: RejectedPostData): void {
    throw new RejectPostError(this.id, this.status);
  }
}
