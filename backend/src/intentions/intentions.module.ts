import { Module } from '@nestjs/common';
import { IntentionsService } from './intentions.service';
import { IntentionsController } from './intentions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({
    secret: process.env.SECRET
  })],
  controllers: [IntentionsController],
  providers: [IntentionsService],
})
export class IntentionsModule { }
