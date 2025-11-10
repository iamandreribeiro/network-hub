import { PartialType } from '@nestjs/mapped-types';
import { CreateIntentionDto } from './create-intention.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateIntentionDto extends PartialType(CreateIntentionDto) {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  empresa: string;

  @IsString()
  motivoParticipacao: string;

  @IsString()
  @IsNotEmpty()
  status: Status;
}
