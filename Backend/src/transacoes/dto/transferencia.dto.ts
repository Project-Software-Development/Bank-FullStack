import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferenciaDto {
  @ApiProperty({
    example: '12345678-8',
    description: 'Numero da conta destino.',
  })
  @IsString()
  @IsNotEmpty()
  contaDestinoNumero: string;

  @ApiProperty({
    example: 100,
    description: 'Valor da transferencia em reais.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(',', '.')) : value,
  )
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;
}
