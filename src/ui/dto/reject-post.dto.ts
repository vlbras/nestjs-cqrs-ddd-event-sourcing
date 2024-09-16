import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RejectPostDto {
  @IsString()
  @IsNotEmpty()
  public reason: string;

  @IsMongoId()
  public rejectedBy: string;
}
