import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class EventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventTitle: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  eventDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  eventCity: string;
}
