import { PostStatuses } from '@domain/enums/post-statuses.enum';

import { Post } from './post.entity';
import { RejectedPost, RejectedPostData } from './rejected-post.entity';

export class ApprovedPost extends Post<ApprovedPostData> {
  public constructor(id: string, data: ApprovedPostData) {
    super(id, PostStatuses.APPROVED, data);
    this.data.approvedAt = new Date().toISOString();
  }

  public reject(data: RejectedPostData): RejectedPost {
    return new RejectedPost(this.id, data);
  }
}

export type ApprovedPostData = {
  approvedBy: string;
  approvedAt?: string;
};
