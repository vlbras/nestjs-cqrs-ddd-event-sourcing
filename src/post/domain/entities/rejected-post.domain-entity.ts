import { PostStatuses, RejectionReasons } from '@post/domain/enums';

import { Post } from './post.domain-entity';

export class RejectedPost extends Post<RejectedPostData> {
  public constructor(postId: string, data: RejectedPostData) {
    super(postId, PostStatuses.REJECTED, data);
  }
}

export type RejectedPostData = {
  rejectedBy: string;
  reason: RejectionReasons;
  comment?: string;
};
