import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { ReservationsRepository } from './reservations.repository';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repository: ReservationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReservationsRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        ReservationsService,
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
