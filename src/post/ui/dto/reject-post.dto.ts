import { RejectionReasons } from '@post/domain/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'nestjs-object-id';

export class RejectPostDto {
  @IsEnum(RejectionReasons)
  public reason: RejectionReasons;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public comment?: string;

  @IsObjectId()
  public rejectedBy: string;
}
