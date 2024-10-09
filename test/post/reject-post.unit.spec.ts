import { EventBus } from '@nestjs/cqrs';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { RejectPostCommandHandler, RejectPostCommand } from '@post/application/commands';
import { PostStatusUpdatedEvent } from '@post/application/events';
import { PostStatuses, RejectionReasons } from '@post/domain/enums';
import { RejectPostError } from '@post/domain/errors';
import { PostEventEntity, PostEventSchema } from '@post/infrastructure/entities/post-event.entity';
import { PostEntity, PostSchema } from '@post/infrastructure/entities/post.entity';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';
import { anyOfClass, instance, mock, reset, verify } from 'ts-mockito';

import { PostFixture } from './fixtures/post.fixture';

describe('Reject Post Command Handler', () => {
  let module: TestingModule;
  let sut: RejectPostCommandHandler;
  let mongoMemoryServer: MongoMemoryServer;
  let postFixture: PostFixture;
  let eventBusMock: EventBus;
  let postModel: Model<PostEntity>;
  let postEventModel: Model<PostEventEntity>;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create({});
    eventBusMock = mock(EventBus);

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({ uri: mongoMemoryServer.getUri() }),
        }),
        MongooseModule.forFeature([
          { name: PostEntity.name, schema: PostSchema },
          { name: PostEventEntity.name, schema: PostEventSchema },
        ]),
      ],
      providers: [
        RejectPostCommandHandler,
        PostRepository,
        PostEventRepository,
        PostFixture,
        {
          provide: EventBus,
          useValue: instance(eventBusMock),
        },
      ],
    }).compile();

    await module.init();

    sut = module.get(RejectPostCommandHandler);
    postFixture = module.get(PostFixture);
    postModel = module.get(getModelToken(PostEntity.name));
    postEventModel = module.get(getModelToken(PostEventEntity.name));
  });

  beforeEach(async () => {
    await postModel.deleteMany({});
    await postEventModel.deleteMany({});
    await postFixture.deleteAll();

    reset(eventBusMock);
  });

  afterAll(async () => {
    const connection = await module.get(getConnectionToken());
    await connection.close();
    await mongoMemoryServer.stop();
    await module.close();
  });

  it('sut should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe.each([PostStatuses.PENDING, PostStatuses.APPROVED])(
    `should reject post and publish ${PostStatusUpdatedEvent.name}`,
    status => {
      it(`when status is '${status}'`, async () => {
        // given
        const post = await postFixture.createPost({ status });
        const postId = post._id.toString();
        // and
        const command = new RejectPostCommand(postId, {
          rejectedBy: new Types.ObjectId().toString(),
          reason: RejectionReasons.Offensive,
        });

        // when
        await sut.execute(command);

        // then
        const postEvent = await postEventModel.findOne({ postId });
        expect(postEvent).toMatchObject({
          status: PostStatuses.REJECTED,
          data: command.data,
        });
        //and
        verify(eventBusMock.publish(anyOfClass(PostStatusUpdatedEvent))).once();
      });
    },
  );

  describe(`should not approve post and throw ${RejectPostError.name}`, () => {
    it(`when status is '${PostStatuses.REJECTED}'`, async () => {
      // given
      const post = await postFixture.createPost({
        status: PostStatuses.REJECTED,
      });
      const postId = post._id.toString();

      // and
      const command = new RejectPostCommand(postId, {
        rejectedBy: new Types.ObjectId().toString(),
        reason: RejectionReasons.Offensive,
      });

      // then
      await expect(sut.execute(command)).rejects.toThrow(RejectPostError);
    });
  });
});
