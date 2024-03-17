import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE, HOTELS_SERVICE, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(HOTELS_SERVICE) private readonly hotelsService: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}
  context: ExecutionContext;

  // async create(createReservationDto: CreateReservationDto, req) {
  //   const userId = 'test';
  //   const hotelId = createReservationDto.hotelId;
  //   const jwt = req?.cookies?.Authentication || req?.headers?.authentication;

  //   console.log('----------Auth Guard--------', jwt, hotelId);
  //   const answer = this.authService.send('validateToken', {
  //     Authentication: jwt,
  //   });
  //   console.log('-------answer--------', answer);
  //   return this.authService
  //     .send('validateToken', {
  //       Authentication: jwt,
  //     })
  //     .pipe(
  //       map((res) => {
  //         return this.reservationsRepository.create({
  //           ...createReservationDto,
  //           reservationId: res.reservationId || userId,
  //           timestamp: new Date(),
  //           userId: res.userId || userId,
  //         });
  //       }),
  //     );
  // }

  async create(createReservationDto: CreateReservationDto) {
    const hotelId = createReservationDto.hotelId;
    return this.hotelsService
      .send('book_hotel', {
        hotelId,
      })
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            reservationId: res.reservationId,
            timestamp: new Date(),
            userId: res.userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
