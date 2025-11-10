import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service'; // A dependência

const mockPrismaService = {
  member: {
    count: jest.fn(),
  },
};

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPerformanceStats', () => {
    it('should return member count and mocked data', async () => {
      const mockMemberCount = 10;
      (mockPrismaService.member.count as jest.Mock).mockResolvedValue(mockMemberCount);

      const result = await service.getPerformanceStats();

      expect(mockPrismaService.member.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        totalMembros: 10,
        totalIndicacoesMes: 5,  // (10 / 2)
        totalObrigadosMes: 10 / 3, // (10 / 3)
      });
    });
  });
});