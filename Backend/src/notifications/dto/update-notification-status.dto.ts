import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateNotificationStatusDto {
  @ApiProperty({
    example: true,
    description: "Indica se a notificacao foi lida pelo usuario.",
  })
  @IsBoolean()
  lida: boolean;
}
