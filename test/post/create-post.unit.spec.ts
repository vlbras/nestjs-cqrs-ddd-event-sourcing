import { EventBus } from '@nestjs/cqrs';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { CreatePostCommand, CreatePostCommandHandler } from '@post/application/commands';
import { PostCreatedEvent } from '@post/application/events';
import { AuthorReputations, PostPriorities, PostStatuses } from '@post/domain/enums';
import { PostEntity, PostSchema } from '@post/infrastructure/entities/post.entity';
import { PostRepository } from '@post/infrastructure/repositories/post.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';
import { anyOfClass, instance, mock, reset, verify } from 'ts-mockito';

describe('Create Post Command Handler', () => {
  let module: TestingModule;
  let sut: CreatePostCommandHandler;
  let mongoMemoryServer: MongoMemoryServer;
  let eventBusMock: EventBus;
  let postModel: Model<PostEntity>;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create({});
    eventBusMock = mock(EventBus);

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({ uri: mongoMemoryServer.getUri() }),
        }),
        MongooseModule.forFeature([{ name: PostEntity.name, schema: PostSchema }]),
      ],
      providers: [
        CreatePostCommandHandler,
        PostRepository,
        {
          provide: EventBus,
          useValue: instance(eventBusMock),
        },
      ],
    }).compile();

    await module.init();

    sut = module.get(CreatePostCommandHandler);
    postModel = module.get(getModelToken(PostEntity.name));
  });

  beforeEach(async () => {
    await postModel.deleteMany({});

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

  it(`should create post in '${PostStatuses.PENDING}' status and publish ${PostCreatedEvent.name}`, async () => {
    // given
    const command = new CreatePostCommand({
      title: 'title',
      content: 'content',
      eventData: {
        priority: PostPriorities.HIGH,
        authorReputation: AuthorReputations.EXPERT,
      },
      authorId: new Types.ObjectId().toString(),
    });
    // and
    const status = PostStatuses.PENDING;

    // when
    await sut.execute(command);

    // then
    const post = await postModel.find();
    expect(post[0].status).toBe(status);
    //and
    verify(eventBusMock.publish(anyOfClass(PostCreatedEvent))).once();
  });
});
