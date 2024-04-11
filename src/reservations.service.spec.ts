import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
//import { User } from './entities/user.entity';
import { ReservationsService } from './reservations.service';

describe('UsersService', () => {
  let service: ReservationsService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(() => {}),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', () => {});

  it('findAll', () => {});
  it('findOne', () => {});
  it('update', () => {});
  it('remove', () => {});
});
