import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { truncate } from './helper/integrationTestHelper';
import { EntityManager } from 'typeorm';
import { EventEntity } from 'src/module/event/database/event.entity';
import { randomUUID } from 'crypto';

describe('EventController (e2e)', () => {
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

  describe('get all events', () => {
    it('should return an empty array', async () => {
      return request(app.getHttpServer())
        .get(`/v1/event`)
        .expect(200)
        .expect([]);
    });

    it('should return an array of events', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'testEvent',
      });

      return request(app.getHttpServer())
        .get(`/v1/event`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([
            {
              id: event.id,
              eventTitle: event.eventTitle,
              eventDate: event.eventDate,
              eventCity: event.eventCity,
              deletedAt: null,
              updatedAt: event.updatedAt.toISOString(),
              createdAt: event.createdAt.toISOString(),
              tickets: [],
            },
          ]);
        });
    });
  });

  describe('get one event', () => {
    it('should return one event', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'testEvent',
      });

      return request(app.getHttpServer())
        .get(`/v1/event/${event.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: event.id,
            eventTitle: event.eventTitle,
            eventDate: event.eventDate,
            eventCity: event.eventCity,
            deletedAt: null,
            updatedAt: event.updatedAt.toISOString(),
            createdAt: event.createdAt.toISOString(),
          });
        });
    });

    it('should return an error for not correct id', async () => {
      return request(app.getHttpServer())
        .get(`/v1/event/notAnUUID`)
        .expect(400);
    });

    it('should return an error for not correct id', async () => {
      const randomID = randomUUID();

      return request(app.getHttpServer())
        .get(`/v1/event/${randomID}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body).toEqual({
            statusCode: 404,
            message: `There is no event with id ${randomID}`,
          });
        });
    });
  });

  describe('create an event', () => {
    it('should create an new event', async () => {
      const event = { eventTitle: 'newTestEvent' };

      const createdEventRequest = await request(app.getHttpServer())
        .post(`/v1/event`)
        .send(event)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      const createdEvent = createdEventRequest.body;

      return request(app.getHttpServer())
        .get(`/v1/event/${createdEvent.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...createdEvent,
          });
        });
    });
  });

  describe('update an event', () => {
    it('should update an exsiting event', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'testEventToBeUpdated',
      });

      const updatedEvent = { eventTitle: 'updatedTestEvent' };

      await request(app.getHttpServer())
        .put(`/v1/event/${event.id}`)
        .send(updatedEvent)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/v1/event/${event.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            id: event.id,
            eventTitle: updatedEvent.eventTitle,
            eventDate: event.eventDate,
            eventCity: event.eventCity,
            deletedAt: null,
            // Could be solved better with jest fake timers
            updatedAt: expect.any(String),
            createdAt: event.createdAt.toISOString(),
          });
        });
    });
  });

  describe('delete an event', () => {
    it('should delete an exsiting event', async () => {
      const event = await entityManager.save(EventEntity, {
        eventTitle: 'testEventToBeUpdated',
      });

      await request(app.getHttpServer())
        .delete(`/v1/event/${event.id}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/v1/event/${event.id}`)
        .expect(404)
        .expect(({ body }) => {
          expect(body).toEqual({
            statusCode: 404,
            message: `There is no event with id ${event.id}`,
          });
        });
    });
  });
});
