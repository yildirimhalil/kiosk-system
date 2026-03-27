import { IsString } from 'class-validator';

export class TableResponseDto {
  @IsString()
  id: string;

  @IsString()
  number: string;

  @IsString()
  status: string;
}
