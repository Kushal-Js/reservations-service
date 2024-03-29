import { IsNotEmpty, IsString } from 'class-validator';

export class GetReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;
}
