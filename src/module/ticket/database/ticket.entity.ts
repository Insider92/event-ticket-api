import { AbstractOrmEntity } from 'src/model/abstract.entity';
import { EventEntity } from 'src/module/event/database/event.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('ticket')
export class TicketEntity extends AbstractOrmEntity {
  @Column({ type: 'varchar', length: 8, nullable: false })
  barcode: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @ManyToOne((type) => EventEntity, (event) => event.id)
  event: EventEntity;
}
