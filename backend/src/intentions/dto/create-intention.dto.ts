import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
export class CreateIntentionDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  empresa: string;

  @IsString()
  @IsNotEmpty()
  motivoParticipacao: string;
}
