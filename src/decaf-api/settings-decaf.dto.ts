import { ApiProperty } from '@nestjs/swagger';

/**
 * Class representing visibility settings for a user's profile.
 */
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

/**
 * Data Transfer Object representing the Decaf settings.
 *
 * This object is used to transfer user settings related to the Decaf application.
 *
 * @property visibility - An instance of the Visibility class which contains the user-specific settings visibility options.
 */
export class SettingsDecafDto {
  @ApiProperty({
    description: 'User settings.',
  })
  visibility: Visibility;
}
