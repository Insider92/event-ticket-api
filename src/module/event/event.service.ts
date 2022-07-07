import { Injectable } from '@nestjs/common';
import { EventEntity } from './database/event.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  async getAll(): Promise<EventDto[]> {
    return await this.eventRepository.find({ relations: ['tickets'] });
  }

  async getOne(id: string): Promise<EventDto> {
    return await this.eventRepository.findOne({ where: { id: id } });
  }

  async create(event: EventDto): Promise<EventDto> {
    return await this.eventRepository.save(event);
  }

  async update(id: string, event: EventDto): Promise<UpdateResult> {
    return await this.eventRepository.update(id, event);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.eventRepository.delete(id);
  }
}
