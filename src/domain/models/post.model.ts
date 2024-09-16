import { PostStatuses } from '@domain/enums/post-statuses.enum';

export type PostModel = {
  id: string;
  title: string;
  content: string;
  status: PostStatuses;
  authorId: string;
  eventData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
