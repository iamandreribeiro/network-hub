import { Test, TestingModule } from '@nestjs/testing';
import { IntentionsController } from './intentions.controller';
import { IntentionsService } from './intentions.service';

const mockIntentionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findToken: jest.fn(),
};

describe('IntentionsController', () => {
  let controller: IntentionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntentionsController],
      providers: [
        { provide: IntentionsService, useValue: mockIntentionsService },
      ],
    }).compile();

    controller = module.get<IntentionsController>(IntentionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});