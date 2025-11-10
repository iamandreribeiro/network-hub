import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  async create(createMemberDto: CreateMemberDto) {
    try {
      const payload = this.jwtService.verify(createMemberDto.token);

      if (payload.id) {
        const id = payload.id;
        const hashSenha = await bcrypt.hash(createMemberDto.senha, 10);
        const userData = await this.prisma.intention.findUnique({
          where: {
            id: id,
          },
        });

        if (userData) {
          return await this.prisma.member.create({
            data: {
              nome: userData?.nome,
              email: userData?.email,
              hashSenha: hashSenha
            }
          })
        }
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  findAll() {
    return `This action returns all members`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
