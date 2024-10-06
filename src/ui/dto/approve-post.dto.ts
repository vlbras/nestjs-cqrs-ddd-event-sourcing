import { IsObjectId } from 'nestjs-object-id';

export class ApprovePostDto {
  @IsObjectId()
  public approvedBy: string;
}
