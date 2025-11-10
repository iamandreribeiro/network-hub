import { IsString, IsNotEmpty } from 'class-validator';
export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
