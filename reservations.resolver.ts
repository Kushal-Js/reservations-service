import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationDocument } from './src/models/reservation.schema';
import { ReservationsService } from './src/reservations.service';
import { CreateReservationDto } from './src/dto/create-reservation.dto';
import { CurrentUser, UserDto } from '@app/common';
import { Query } from '@nestjs/graphql';

@Resolver(() => ReservationDocument)
export class ReservationResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => ReservationDocument)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Query(() => [ReservationDocument], { name: 'reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Query(() => ReservationDocument, { name: 'reservation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => ReservationDocument)
  removeReservation(@Args('id', { type: () => String }) id: string) {
    this.reservationsService.remove(id);
  }
}
