import { Injectable } from '@nestjs/common';
import { CreateIntentionDto } from './dto/create-intention.dto';
import { UpdateIntentionDto } from './dto/update-intention.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IntentionsService {
  constructor(private prisma: PrismaService) {}
  async create(createIntentionDto: CreateIntentionDto) {
    return await this.prisma.intention.create({
      data: createIntentionDto,
    });
  }

  async findAll() {
    return await this.prisma.intention.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.intention.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateIntentionDto: UpdateIntentionDto) {
    return `This action updates a #${id} intention`;
  }

  remove(id: number) {
    return `This action removes a #${id} intention`;
  }
}
