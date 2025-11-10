import { Test, TestingModule } from '@nestjs/testing';
import { IntentionsService } from './intentions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException } from '@nestjs/common';

const mockPrismaService = {
  intention: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  invitation: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailerService = {
  sendMail: jest.fn(),
};

describe('IntentionsService', () => {
  let service: IntentionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntentionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<IntentionsService>(IntentionsService);

    mockPrismaService.$transaction.mockImplementation(async (prismaPromises) => {
      return await Promise.all(prismaPromises);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update (Aprovar)', () => {
    it('should approve, create invitation, and send email', async () => {
      const id = 1;
      const dto = { status: 'APROVADO' };
      const mockIntention = { id: 1, nome: 'Andre', email: 'andre@test.com' };
      const mockToken = 'fake-jwt-token';
      const mockLink = `http://localhost:3000/register/${mockToken}`;

      (mockPrismaService.intention.findUnique as jest.Mock).mockResolvedValue(mockIntention);
      (mockJwtService.sign as jest.Mock).mockReturnValue(mockToken);
      (mockMailerService.sendMail as jest.Mock).mockResolvedValue(true);

      await service.update(id, dto);

      expect(mockPrismaService.intention.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id });
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.intention.update).toHaveBeenCalled();
      expect(mockPrismaService.invitation.create).toHaveBeenCalled();
      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: mockIntention.email })
      );
    });
  });

  describe('findToken (Validate)', () => {
    it('should return intention data if token is valid', async () => {
      const mockToken = 'valid-token';
      const mockPayload = { id: 1 };
      const mockIntention = { id: 1, nome: 'Andre', status: 'APROVADO' };

      (mockJwtService.verify as jest.Mock).mockReturnValue(mockPayload);
      (mockPrismaService.intention.findUnique as jest.Mock).mockResolvedValue(mockIntention);

      const result = await service.findToken(mockToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith(mockToken);
      expect(mockPrismaService.intention.findUnique).toHaveBeenCalledWith({ where: { id: mockPayload.id } });
      expect(result).toEqual(mockIntention);
    });

    it('should throw error if token is invalid', async () => {
      (mockJwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(service.findToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});