import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateIntentionDto } from './dto/create-intention.dto';
import { UpdateIntentionDto } from './dto/update-intention.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class IntentionsService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private mailerService: MailerService) { }
  async create(createIntentionDto: CreateIntentionDto) {
    return await this.prisma.intention.create({
      data: createIntentionDto,
    });
  }

  async findAll() {
    return await this.prisma.intention.findMany({
      where: {
        status: 'PENDENTE'
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.intention.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.id) {
        return await this.prisma.intention.findUnique({
          where: {
            id: payload.id,
          },
        });
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async update(id: number, updateIntentionDto: UpdateIntentionDto) {
    const userData = await this.prisma.intention.findUnique({
      where: {
        id: id
      }
    })
    if (updateIntentionDto.status == 'APROVADO') {
      const token = this.jwtService.sign({ id: id });
      const URL = process.env.BACKEND_ENDPOINT + `register/${token}`;

      await this.prisma.$transaction([
        this.prisma.intention.update({
          where: {
            id: id,
          },
          data: updateIntentionDto
        }),
        this.prisma.invitation.create({
          data: {
            idIntention: id,
            token: token
          }
        })
      ]);

      if (userData) {
        console.log(`Email simulado para ${userData.email} com o link: ${URL}`);

        try {
          await this.mailerService.sendMail({
            to: userData.email,
            cc: process.env.MAIL_USER,
            from: process.env.MAIL_USER,
            subject: 'Sua intenção foi aprovada! Complete seu cadastro no Network Hub.',
            html: `
              <strong>Olá, ${userData.nome}!</strong><br>
              <p>Sua intenção para participar do Network Hub foi aprovada.</p>
              <p>Por favor, complete seu cadastro clicando no link abaixo.</p>
              <a href="${URL}" target="_blank">Completar cadastro</a>
            `,
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      await this.prisma.intention.update({
        where: {
          id: id,
        },
        data: updateIntentionDto
      })
    }
  }

  remove(id: number) {
    return `This action removes a #${id} intention`;
  }
}
