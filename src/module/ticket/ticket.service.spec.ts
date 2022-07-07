import { Test, TestingModule } from '@nestjs/testing';
import { EventDto } from '../event/dto/event.dto';
import { TicketDto } from './dto/ticket.dto';
import { TicketService } from './ticket.service';

class TicketServiceMock {
  getAll(id: string) {
    return [];
  }
  getOne(id: string) {
    return [];
  }
  create(event: TicketDto) {
    return TicketDto;
  }
  update(id: string, event: TicketDto) {
    return [];
  }
  delete(id: string) {
    return [];
  }
  eventExists(eventId: string) {
    return EventDto;
  }
}

describe('TicketService', () => {
  let ticketService: TicketService;

  beforeAll(async () => {
    const TicketServiceProvider = {
      provide: TicketService,
      useClass: TicketServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketService, TicketServiceProvider],
    }).compile();

    ticketService = module.get<TicketService>(TicketService);
  });

  const id = 'df50269f-508b-45a1-8cd0-c723e243227f';
  const eventId = '91658a9f-1051-438b-a8f0-c926b6550530';

  describe('Event Service', () => {
    it('should call getAll methode with expected parameters', async () => {
      const createEventSpy = jest.spyOn(ticketService, 'getAll');
      ticketService.getAll();
      expect(createEventSpy).toHaveBeenCalledWith();
    });

    it('should call getOne methode with expected parameters', async () => {
      const createEventSpy = jest.spyOn(ticketService, 'getOne');
      ticketService.getOne(id);
      expect(createEventSpy).toHaveBeenCalledWith(id);
    });

    it('should call create method with expected params', async () => {
      const updateNoteSpy = jest.spyOn(ticketService, 'create');
      const dto = new TicketDto();
      ticketService.create(dto);
      expect(updateNoteSpy).toHaveBeenCalledWith(dto);
    });

    it('should call update method with expected params', async () => {
      const updateNoteSpy = jest.spyOn(ticketService, 'update');
      const dto = new TicketDto();
      ticketService.update(id, dto);
      expect(updateNoteSpy).toHaveBeenCalledWith(id, dto);
    });

    it('should call delete method with expected param', async () => {
      const deleteNoteSpy = jest.spyOn(ticketService, 'delete');
      ticketService.delete(id);
      expect(deleteNoteSpy).toHaveBeenCalledWith(id);
    });

    it('should call eventExists(with expected param', async () => {
      const eventExistsSpy = jest.spyOn(ticketService, 'eventExists');
      ticketService.eventExists(eventId);
      expect(eventExistsSpy).toHaveBeenCalledWith(eventId);
    });
  });
});
