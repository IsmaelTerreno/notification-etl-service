import { ApiProperty } from '@nestjs/swagger';

class Visibility {
  @ApiProperty({
    description: 'Email visibility.',
  })
  email: boolean;

  @ApiProperty({
    description: 'Name visibility.',
  })
  name: boolean;

  @ApiProperty({
    description: 'Profile photo visibility.',
  })
  profilePhoto: boolean;
}

export class SettingsDecafDto {
  @ApiProperty({
    description: 'User settings.',
  })
  visibility: Visibility;
}
