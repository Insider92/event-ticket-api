import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from '../config/configuration';

import { AppController } from './app.controller';

import { loggerConfig, ormConfig } from './config';
import { EventModule } from './module/event/event.module';
import { TicketModule } from './module/ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(ormConfig),
    TerminusModule,
    HttpModule,
    EventModule,
    TicketModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
