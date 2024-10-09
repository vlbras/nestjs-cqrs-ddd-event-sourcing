import { PostStatuses } from '../enums';

export class RejectPostError extends Error {
  public constructor(
    public readonly id: string,
    public readonly status: PostStatuses,
  ) {
    super(`Cannot reject post in ${status} status`);
  }
}
