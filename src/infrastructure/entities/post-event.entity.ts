import { PostStatuses } from '@domain/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as Property } from 'mongoose';

@Schema()
export class PostEventEntity {
  public _id: Types.ObjectId;

  @Prop({
    index: true,
  })
  public postId: string;

  @Prop({
    type: String,
    enum: PostStatuses,
    default: PostStatuses.PENDING,
    index: true,
  })
  public status: PostStatuses;

  @Prop({ type: Property.Types.Mixed })
  public data: Record<string, unknown>;

  @Prop({
    type: Date,
    default: Date.now,
  })
  public createdAt: Date;
}

export const PostEventSchema = SchemaFactory.createForClass(PostEventEntity);
