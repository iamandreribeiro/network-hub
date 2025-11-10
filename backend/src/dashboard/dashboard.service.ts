import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getPerformanceStats() {
    const totalMembros = await this.prisma.member.count();
    const totalIndicacoesMes = totalMembros / 2;
    const totalObrigadosMes = totalMembros / 3;
    return { totalMembros, totalIndicacoesMes, totalObrigadosMes }
  }
}
