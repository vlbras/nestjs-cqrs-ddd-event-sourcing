import { AuthorReputations, PostPriorities } from '@post/domain/enums';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'nestjs-object-id';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsObjectId()
  public authorId: string;

  @IsEnum(PostPriorities)
  public priority: PostPriorities;

  @IsEnum(AuthorReputations)
  public authorReputation: AuthorReputations;
}
