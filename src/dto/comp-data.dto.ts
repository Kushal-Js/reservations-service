import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CompDataDto {
  hotelId: string;
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
