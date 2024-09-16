import { PostStatuses } from '@domain/enums/post-statuses.enum';

import { Post } from './post.entity';

export class RejectedPost extends Post<RejectedPostData> {
  public constructor(postId: string, data: RejectedPostData) {
    super(postId, PostStatuses.REJECTED, data);
    this.data.rejectedAt = new Date().toISOString();
  }
}

export type RejectedPostData = {
  rejectedBy: string;
  reason: string;
  rejectedAt?: string;
};
