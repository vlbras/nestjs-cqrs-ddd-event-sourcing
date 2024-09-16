import { PostStatuses } from '@domain/enums/post-statuses.enum';

export type PostEventModel = {
  postId: string;
} & {
  [key in PostStatuses]: Record<string, unknown>;
};
