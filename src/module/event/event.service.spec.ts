import { Test, TestingModule } from '@nestjs/testing';
import { EventDto } from './dto/event.dto';
import { EventService } from './event.service';

class EventServiceMock {
  getAll(id: string) {
    return [];
  }
  getOne(id: string) {
    return [];
  }
  create(event: EventDto) {
    return EventDto;
  }
  update(id: string, event: EventDto) {
    return [];
  }
  delete(id: string) {
    return [];
  }
}

describe('EventService', () => {
  let eventService: EventService;

  beforeAll(async () => {
    const EventServiceProvider = {
      provide: EventService,
      useClass: EventServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, EventServiceProvider],
    }).compile();

    eventService = module.get<EventService>(EventService);
  });

  const id = 'df50269f-508b-45a1-8cd0-c723e243227f';

  describe('Event Service', () => {
    it('should call getAll methode with expected parameters', async () => {
      const createEventSpy = jest.spyOn(eventService, 'getAll');
      eventService.getAll();
      expect(createEventSpy).toHaveBeenCalledWith();
    });

    it('should call getOne methode with expected parameters', async () => {
      const createEventSpy = jest.spyOn(eventService, 'getOne');
      eventService.getOne(id);
      expect(createEventSpy).toHaveBeenCalledWith(id);
    });

    it('should call create method with expected params', async () => {
      const updateNoteSpy = jest.spyOn(eventService, 'create');
      const dto = new EventDto();
      eventService.create(dto);
      expect(updateNoteSpy).toHaveBeenCalledWith(dto);
    });

    it('should call update method with expected params', async () => {
      const updateNoteSpy = jest.spyOn(eventService, 'update');
      const dto = new EventDto();
      eventService.update(id, dto);
      expect(updateNoteSpy).toHaveBeenCalledWith(id, dto);
    });

    it('should call delete method with expected param', async () => {
      const deleteNoteSpy = jest.spyOn(eventService, 'delete');
      eventService.delete(id);
      expect(deleteNoteSpy).toHaveBeenCalledWith(id);
    });
  });
});
