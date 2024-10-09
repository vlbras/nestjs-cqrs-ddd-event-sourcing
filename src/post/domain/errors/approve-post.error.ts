import { PostStatuses } from '../enums';

export class ApprovePostError extends Error {
  public constructor(
    public readonly id: string,
    public readonly status: PostStatuses,
  ) {
    super(`Cannot approve post in ${status} status`);
  }
}
