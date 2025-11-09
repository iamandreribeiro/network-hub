import { Test, TestingModule } from '@nestjs/testing';
import { IntentionsController } from './intentions.controller';
import { IntentionsService } from './intentions.service';

describe('IntentionsController', () => {
  let controller: IntentionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntentionsController],
      providers: [IntentionsService],
    }).compile();

    controller = module.get<IntentionsController>(IntentionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
