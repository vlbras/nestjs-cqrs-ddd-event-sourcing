import { PostPriorities } from '@domain/enums/post-priorities.enum';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsMongoId()
  public authorId: string;

  @IsEnum(PostPriorities)
  public priority: PostPriorities;

  @IsNumber()
  public authorReputation: number;
}
