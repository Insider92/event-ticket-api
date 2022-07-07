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
import { UpdateResult, DeleteResult } from 'typeorm';
import { TicketDto } from '../dto/ticket.dto';
import { TicketService } from '../ticket.service';

@Controller('v1/ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  @ApiOperation({
    description: 'Delivers an array of tickets',
  })
  @ApiResponse({
    status: 200,
    type: TicketDto,
    isArray: true,
  })
  async GetAll(): Promise<TicketDto[]> {
    return await this.ticketService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    description: 'Delivers a ticket by id',
  })
  @ApiResponse({
    status: 200,
    type: TicketDto,
  })
  @ApiResponse({
    status: 404,
    description: 'There is no ticket with the given id',
  })
  async GetOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TicketDto> {
    const ticket = await this.ticketService.getOne(id);
    if (!ticket)
      throw new HttpException(`There is no ticket with id ${id}`, 404);
    return ticket;
  }

  @ApiOperation({
    description: 'Creates a ticket',
  })
  @ApiResponse({
    status: 404,
    description: 'There is no related event for the given ticket',
  })
  @Post()
  async Create(@Body() ticket: TicketDto): Promise<TicketDto> {
    const eventExists = await this.ticketService.eventExists(ticket.event.id);
    if (!eventExists)
      throw new HttpException(
        `There is no related event with id ${ticket.event.id}`,
        404,
      );
    return await this.ticketService.create(ticket);
  }

  @ApiOperation({
    description: 'Updates a ticket',
  })
  @Put(':id')
  async Update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() ticket: TicketDto,
  ): Promise<UpdateResult> {
    return await this.ticketService.update(id, ticket);
  }

  @ApiOperation({
    description: 'Deletes a ticket',
  })
  @Delete(':id')
  async Delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DeleteResult> {
    return await this.ticketService.delete(id);
  }
}
