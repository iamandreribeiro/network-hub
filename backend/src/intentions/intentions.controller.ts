import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { IntentionsService } from './intentions.service';
import { CreateIntentionDto } from './dto/create-intention.dto';
import { UpdateIntentionDto } from './dto/update-intention.dto';

@Controller('intentions')
export class IntentionsController {
  constructor(private readonly intentionsService: IntentionsService) { }

  @Post()
  async create(@Body() createIntentionDto: CreateIntentionDto) {
    try {
      const result = await this.intentionsService.create(createIntentionDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Intention created successfully',
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: `A record with this ${error.meta.target.join(', ')} already exists.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  @Get()
  findAll() {
    return this.intentionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intentionsService.findOne(+id);
  }

  @Get('validate/:token')
  findToken(@Param('token') token: string) {
    return this.intentionsService.findToken(token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntentionDto: UpdateIntentionDto,
  ) {
    return this.intentionsService.update(+id, updateIntentionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intentionsService.remove(+id);
  }
}
