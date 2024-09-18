import { AuthorReputations, PostPriorities, PostStatuses } from '@domain/enums';

import { ApprovedPost, ApprovedPostData } from './approved-post.entity';
import { Post } from './post.entity';
import { RejectedPost, RejectedPostData } from './rejected-post.entity';

export class PendingPost extends Post<PendingPostData> {
  public constructor(id: string, data: PendingPostData) {
    super(id, PostStatuses.PENDING, data);
  }

  public approve(data: ApprovedPostData): ApprovedPost {
    return new ApprovedPost(this.id, data);
  }

  public reject(data: RejectedPostData): RejectedPost {
    return new RejectedPost(this.id, data);
  }
}

export type PendingPostData = {
  priority: PostPriorities;
  authorReputation: AuthorReputations;
};
