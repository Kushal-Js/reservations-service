import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard, Roles } from '@app/common';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: Request,
  ) {
    const hotelId = createReservationDto.hotelId;
    const isReservationAvailable =
      this.reservationsService.checkExistingReservation(
        hotelId,
        createReservationDto,
      );
    return isReservationAvailable.then((data) => {
      if (data) {
        return this.reservationsService.create(createReservationDto, req);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Hotel is already booked, choose another data',
          },
          HttpStatus.FORBIDDEN,
          {
            cause: 'Hotel is already booked, choose another data',
          },
        );
      }
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }

  @Get('hello')
  async getHello() {
    return 'Hello from reservations service';
  }
}
