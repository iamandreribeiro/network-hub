import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { PrismaService } from 'src/prisma/prisma.service'; // A dependência real
import { JwtService } from '@nestjs/jwt'; // A dependência real
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockPrismaService = {
  intention: {
    findUnique: jest.fn(),
  },
  member: {
    create: jest.fn(),
  },
};

const mockJwtService = {
  verify: jest.fn(),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('MembersService', () => {
  let service: MembersService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new member if the token is valid', async () => {
      const dto = { token: 'valid.token', senha: 'password123' };
      const mockPayload = { id: 1 };
      const mockIntention = { id: 1, nome: 'Andre', email: 'andre@test.com', status: 'APROVADO' };
      const mockHashedPassword = 'hashed-password';
      const mockCreatedMember = { id: 1, ...mockIntention, hashSenha: mockHashedPassword };

      (mockJwtService.verify as jest.Mock).mockReturnValue(mockPayload);
      (mockPrismaService.intention.findUnique as jest.Mock).mockResolvedValue(mockIntention);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (mockPrismaService.member.create as jest.Mock).mockResolvedValue(mockCreatedMember);

      const result = await service.create(dto);

      expect(mockJwtService.verify).toHaveBeenCalledWith(dto.token);
      expect(mockPrismaService.intention.findUnique).toHaveBeenCalledWith({ where: { id: mockPayload.id } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.senha, 10);
      expect(mockPrismaService.member.create).toHaveBeenCalledWith({
        data: {
          nome: mockIntention.nome,
          email: mockIntention.email,
          hashSenha: mockHashedPassword,
        },
      });
      expect(result).toEqual(mockCreatedMember);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const dto = { token: 'invalid.token', senha: 'password123' };

      (mockJwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.create(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});