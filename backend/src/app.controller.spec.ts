import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return API health status', async () => {
      await expect(appController.health()).resolves.toEqual({
        status: 'ok',
        database: 'connected',
      });
    });
  });
});