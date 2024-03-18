import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE, HOTELS_SERVICE } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { GetReservationDto } from './dto/get-reservation.dto';
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

  async create(createReservationDto: CreateReservationDto, req) {
    const userId = req?.userId;
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
            hotelId,
            userId,
          });
        }),
      );
  }

  async checkExistingReservation(hotelId: string, createReservationDto) {
    return await this.find({ hotelId }).then((data: any) => {
      if (data.length > 0) {
        return createReservationDto.endDate <= data[0]?.startDate;
      } else {
        return true;
      }
    });
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async find(getReservationDto: GetReservationDto) {
    return this.reservationsRepository.find(getReservationDto);
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
