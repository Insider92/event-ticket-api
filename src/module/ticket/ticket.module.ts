import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketEntity } from './database/ticket.entity';
import { TicketController } from './controller/ticket.controller';
import { EventEntity } from '../event/database/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, EventEntity])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
