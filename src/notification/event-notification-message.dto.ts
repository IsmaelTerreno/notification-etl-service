import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class NotificationInfo {
  @ApiProperty({
    description: 'The title of the notification',
  })
  title: string;
  @ApiProperty({
    description: 'The body text of the notification',
  })
  @IsOptional()
  body?: any;

  @ApiProperty({
    description: 'Any additional JSON data to be sent with the notification',
  })
  @IsOptional()
  data?: any;
}

export class EventNotificationMessageDto {
  @ApiProperty({
    description: 'An array of user IDs to send the notification to',
  })
  @IsString()
  userIds: string[];

  @ApiProperty({
    description: 'Notification info to be sent to the users',
  })
  notification: NotificationInfo;
}
