import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty({
    example: "Pix recebido",
    description: "Titulo curto da notificacao.",
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;

  @ApiProperty({
    example: "Voce recebeu um Pix de R$ 150,00.",
    description: "Corpo resumido da notificacao.",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  body: string;
}
