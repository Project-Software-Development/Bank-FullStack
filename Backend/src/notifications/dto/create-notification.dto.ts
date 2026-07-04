import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  body: string;
}
