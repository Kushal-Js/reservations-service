import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateReservationDto {
  @IsString()
  @Field()
  hotelId: string;
  @IsString()
  @IsOptional()
  @Field()
  reservationId: string;
  @IsDate()
  @Type(() => Date)
  @Field()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @Field()
  endDate: Date;
}
