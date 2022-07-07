import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
  IsString,
} from 'class-validator';
import { EventEntity } from 'src/module/event/database/event.entity';

export class TicketDto {
  @ApiProperty({
    description: 'Has to be an alphanumeric code with maximum eight letters',
    example: 'abc12345',
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(8, {
    message: 'barcode can only be 8 letters',
  })
  barcode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  event: EventEntity;
}
