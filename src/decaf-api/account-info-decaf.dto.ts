import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Represents an Account Information Data Transfer Object for Decaf API.
 *
 * Contains essential account information including id, public key, chain,
 * activation status, and privacy status.
 *
 * The fields are decorated with validation and ApiProperty decorators.
 */
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
    description: 'Index number.',
  })
  @IsNumber()
  index: number;

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
