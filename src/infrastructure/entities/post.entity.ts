import { PostStatuses } from '@domain/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as Property } from 'mongoose';

@Schema({ timestamps: true })
export class PostEntity {
  public _id: Types.ObjectId;
  public createdAt: Date;
  public updatedAt: Date;

  @Prop()
  public title: string;

  @Prop()
  public content: string;

  @Prop({
    type: String,
    enum: PostStatuses,
    default: PostStatuses.PENDING,
  })
  public status: PostStatuses;

  @Prop({ type: Property.Types.Mixed })
  public eventData: Record<string, unknown>;

  @Prop()
  public authorId: string;
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);
