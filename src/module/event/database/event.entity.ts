import { ApiProperty } from '@nestjs/swagger';
import { AbstractOrmEntity } from 'src/model/abstract.entity';
import { TicketEntity } from 'src/module/ticket/database/ticket.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('event')
export class EventEntity extends AbstractOrmEntity {
  @Column({ nullable: false })
  eventTitle: string;

  @Column({ nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  eventCity: string;

  @OneToMany((type) => TicketEntity, (ticket) => ticket.event)
  tickets: TicketEntity[];
}
