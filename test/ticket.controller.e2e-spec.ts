import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { truncate } from './helper/integrationTestHelper';
import { EntityManager } from 'typeorm';
import { TicketEntity } from 'src/module/ticket/database/ticket.entity';
import { randomUUID } from 'crypto';
import { EventEntity } from 'src/module/event/database/event.entity';

describe('TicketController (e2e)', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityManager = testingModule.get<EntityManager>(EntityManager);

    await app.init();
  });

  beforeEach(async () => {
    await truncate(entityManager);
  });

  describe('get all tickets', () => {
    it('should return an empty array', async () => {
      return request(app.getHttpServer())
        .get(`/v1/ticket`)
        .expect(200)
        .expect([]);
    });

    it('should return an array of tickets', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'TestEvent',
      });

      const ticket = await entityManager.save(TicketEntity, {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: event.id,
        },
      });

      return request(app.getHttpServer())
        .get(`/v1/ticket`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([
            {
              id: ticket.id,
              barcode: ticket.barcode,
              lastName: ticket.lastName,
              firstName: ticket.firstName,
              deletedAt: null,
              updatedAt: ticket.updatedAt.toISOString(),
              createdAt: ticket.createdAt.toISOString(),
            },
          ]);
        });
    });
  });

  describe('get one ticket', () => {
    it('should return one ticket', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'TestEvent',
      });

      const ticket = await entityManager.save(TicketEntity, {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: event.id,
        },
      });

      return request(app.getHttpServer())
        .get(`/v1/ticket/${ticket.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: ticket.id,
            barcode: ticket.barcode,
            lastName: ticket.lastName,
            firstName: ticket.firstName,
            deletedAt: null,
            updatedAt: ticket.updatedAt.toISOString(),
            createdAt: ticket.createdAt.toISOString(),
          });
        });
    });

    it('should return an error for not correct id', async () => {
      return request(app.getHttpServer())
        .get(`/v1/ticket/notAnUUID`)
        .expect(400);
    });

    it('should return an error for not correct id', async () => {
      const randomID = randomUUID();

      return request(app.getHttpServer())
        .get(`/v1/ticket/${randomID}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body).toEqual({
            statusCode: 404,
            message: `There is no ticket with id ${randomID}`,
          });
        });
    });
  });

  describe('create an ticket', () => {
    it('should create an new ticket', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'TestEvent',
      });

      const ticket = {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: event.id,
        },
      };

      const createdTicketRequest = await request(app.getHttpServer())
        .post(`/v1/ticket`)
        .send(ticket)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      const createdTicket = createdTicketRequest.body;

      return request(app.getHttpServer())
        .get(`/v1/ticket/${createdTicket.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: createdTicket.id,
            barcode: createdTicket.barcode,
            lastName: createdTicket.lastName,
            firstName: createdTicket.firstName,
            deletedAt: null,
            updatedAt: createdTicket.updatedAt,
            createdAt: createdTicket.createdAt,
          });
        });
    });

    it('should return an error if related event does not exsits ', async () => {
      const randomEventId = randomUUID();
      const ticket = {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: randomEventId,
        },
      };

      return request(app.getHttpServer())
        .post(`/v1/ticket`)
        .send(ticket)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(({ body }) => {
          expect(body).toEqual({
            statusCode: 404,
            message: `There is no related event with id ${randomEventId}`,
          });
        });
    });
  });

  describe('update an ticket', () => {
    it('should update an exsiting ticket', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'TestEvent',
      });

      const ticket = await entityManager.save(TicketEntity, {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: event.id,
        },
      });

      const updatedTicket = {
        lastName: 'updatedMustermann',
        firstName: 'updatedMax',
      };

      await request(app.getHttpServer())
        .put(`/v1/ticket/${ticket.id}`)
        .send(updatedTicket)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/v1/ticket/${ticket.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: ticket.id,
            barcode: ticket.barcode,
            lastName: updatedTicket.lastName,
            firstName: updatedTicket.firstName,
            deletedAt: null,
            // Could be solved better with jest fake timers
            updatedAt: expect.any(String),
            createdAt: ticket.createdAt.toISOString(),
          });
        });
    });
  });

  describe('delete an ticket', () => {
    it('should delete an exsiting ticket', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'TestEvent',
      });

      const ticket = await entityManager.save(TicketEntity, {
        barcode: 'abc12345',
        lastName: 'Mustermann',
        firstName: 'Max',
        event: {
          id: event.id,
        },
      });

      await request(app.getHttpServer())
        .delete(`/v1/ticket/${ticket.id}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/v1/ticket/${ticket.id}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body).toEqual({
            statusCode: 404,
            message: `There is no ticket with id ${ticket.id}`,
          });
        });
    });
  });
});
