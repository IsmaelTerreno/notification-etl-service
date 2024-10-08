import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString } from 'class-validator';
import { AccountInfoDecafDto } from './account-info-decaf.dto';
import { SettingsDecafDto } from './settings-decaf.dto';

/**
 * User information from the Decaf API.
 * This class represents the structure of user information including
 * user ID, username, name, email, photo URL, account information, and settings.
 */
export class UsersInfoDecafDto {
  @ApiProperty({
    description: 'User id from decaf api.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'User name.',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User name.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User photo url.',
  })
  @IsString()
  photoUrl: string;

  @ApiProperty({
    description: 'Related account infos.',
  })
  @IsArray()
  accountInfos: AccountInfoDecafDto[];

  @ApiProperty({
    description: 'Related settings.',
  })
  settings: SettingsDecafDto;
}
