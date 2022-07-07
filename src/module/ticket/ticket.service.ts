import { Injectable } from '@nestjs/common';
import { TicketEntity } from './database/ticket.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketDto } from './dto/ticket.dto';
import { EventEntity } from '../event/database/event.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async getAll(): Promise<TicketDto[]> {
    return await this.ticketRepository.find();
  }

  async getOne(id: string): Promise<TicketDto> {
    return await this.ticketRepository.findOne({ where: { id: id } });
  }

  async create(ticket: TicketDto): Promise<TicketEntity> {
    return await this.ticketRepository.save(ticket);
  }

  async update(id: string, ticket: TicketDto): Promise<UpdateResult> {
    return await this.ticketRepository.update(id, ticket);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.ticketRepository.delete(id);
  }

  async eventExists(eventId: string): Promise<EventEntity> {
    return await this.eventRepository.findOne({ where: { id: eventId } });
  }
}
