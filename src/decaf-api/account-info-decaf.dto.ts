import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccountInfoDecafDto {
  @ApiProperty({
    description: 'Account id from decaf api.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Account public key.',
  })
  @IsString()
  publicKey: string;

  @ApiProperty({
    description: 'Account chain.',
  })
  @IsString()
  chain: string;

  @ApiProperty({
    description: 'Account is activated.',
  })
  @IsString()
  isActivated: boolean;

  @ApiProperty({
    description: 'Account is private.',
  })
  @IsString()
  isPrivate: boolean;
}
