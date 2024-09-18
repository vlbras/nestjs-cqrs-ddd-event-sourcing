import { AuthorReputations, PostPriorities } from '@domain/enums';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

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

  @IsEnum(AuthorReputations)
  public authorReputation: AuthorReputations;
}
