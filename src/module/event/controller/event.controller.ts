import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventDto } from '../dto/event.dto';
import { EventService } from '../event.service';

@Controller('v1/event')
@ApiTags('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get()
  @ApiOperation({
    description: 'Delivers an array of events with related tickets',
  })
  @ApiResponse({
    status: 200,
    type: EventDto,
    isArray: true,
  })
  async GetAll(): Promise<EventDto[]> {
    return await this.eventService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    description: 'Delivers an event by id',
  })
  @ApiResponse({
    status: 200,
    type: EventDto,
  })
  @ApiResponse({
    status: 404,
    description: 'There is no event with the given id',
  })
  async GetOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const event = await this.eventService.getOne(id);
    if (!event) throw new HttpException(`There is no event with id ${id}`, 404);
    return event;
  }

  @ApiOperation({
    description: 'Creates an event',
  })
  @Post()
  async Create(@Body() event: EventDto) {
    return await this.eventService.create(event);
  }

  @ApiOperation({
    description: 'Updates an event',
  })
  @Put(':id')
  async Update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() event: EventDto,
  ) {
    return await this.eventService.update(id, event);
  }

  @ApiOperation({
    description: 'Deletes an event',
  })
  @Delete(':id')
  async Delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.eventService.delete(id);
  }
}
