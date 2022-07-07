import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class EventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventTitle: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  eventDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  eventCity: string;
}
