import { EventBus } from '@nestjs/cqrs';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { ApprovePostCommandHandler, ApprovePostCommand } from '@post/application/commands';
import { PostStatusUpdatedEvent } from '@post/application/events';
import { PostStatuses } from '@post/domain/enums';
import { ApprovePostError } from '@post/domain/errors';
import { PostEventEntity, PostEventSchema } from '@post/infrastructure/entities/post-event.entity';
import { PostEntity, PostSchema } from '@post/infrastructure/entities/post.entity';
import { PostEventRepository } from '@post/infrastructure/repositories/post-event.repository';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';
import { anyOfClass, instance, mock, reset, verify } from 'ts-mockito';

import { PostFixture } from './fixtures/post.fixture';

describe('Approve Post Command Handler', () => {
  let module: TestingModule;
  let sut: ApprovePostCommandHandler;
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
        ApprovePostCommandHandler,
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

    sut = module.get(ApprovePostCommandHandler);
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

  describe(`should approve post and publish ${PostStatusUpdatedEvent.name}`, () => {
    it(`when status is '${PostStatuses.PENDING}'`, async () => {
      // given
      const post = await postFixture.createPost();
      const postId = post._id.toString();
      // and
      const command = new ApprovePostCommand(postId, { approvedBy: new Types.ObjectId().toString() });

      // when
      await sut.execute(command);

      // then
      const postEvent = await postEventModel.findOne({ postId });
      expect(postEvent).toMatchObject({
        status: PostStatuses.APPROVED,
        data: command.data,
      });
      //and
      verify(eventBusMock.publish(anyOfClass(PostStatusUpdatedEvent))).once();
    });
  });

  describe.each([PostStatuses.APPROVED, PostStatuses.REJECTED])(
    `should not approve post and throw ${ApprovePostError.name}`,
    status => {
      it(`when status is '${status}'`, async () => {
        // given
        const post = await postFixture.createPost({
          status,
        });
        const postId = post._id.toString();

        // and
        const command = new ApprovePostCommand(postId, { approvedBy: new Types.ObjectId().toString() });

        // then
        await expect(sut.execute(command)).rejects.toThrow(ApprovePostError);
      });
    },
  );
});
