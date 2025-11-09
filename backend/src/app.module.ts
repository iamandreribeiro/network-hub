import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntentionsModule } from './intentions/intentions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [IntentionsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
