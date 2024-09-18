import { RejectionReasons } from '@domain/enums';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RejectPostDto {
  @IsEnum(RejectionReasons)
  public reason: RejectionReasons;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public comment?: string;

  @IsMongoId()
  public rejectedBy: string;
}
