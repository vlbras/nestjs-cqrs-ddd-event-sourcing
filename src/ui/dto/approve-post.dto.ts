import { IsMongoId } from 'class-validator';

export class ApprovePostDto {
  @IsMongoId()
  public approvedBy: string;
}
