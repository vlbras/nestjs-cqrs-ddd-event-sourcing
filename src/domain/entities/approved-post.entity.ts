import { PostStatuses } from '@domain/enums';

import { Post } from './post.entity';
import { RejectedPost, RejectedPostData } from './rejected-post.entity';

export class ApprovedPost extends Post<ApprovedPostData> {
  public constructor(id: string, data: ApprovedPostData) {
    super(id, PostStatuses.APPROVED, data);
  }

  public reject(data: RejectedPostData): RejectedPost {
    return new RejectedPost(this.id, data);
  }
}

export type ApprovedPostData = {
  approvedBy: string;
};
