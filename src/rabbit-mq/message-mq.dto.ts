import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Represents the details of a message.
 *
 * This class is used to transfer message details, including a pattern to match
 * the message and the message payload.
 *
 * Properties:
 *
 * - `pattern`: A string that specifies the pattern where the message should be matched.
 * - `data`: The payload of the message, which can be of any type.
 */
class MessageDetailDto {
  @ApiProperty({
    description: 'Pattern where to match the message.',
  })
  @IsString()
  pattern: string;

  @ApiProperty({
    description: 'Payload of the message.',
  })
  data: any;
}

export class MessageMqDto {
  @ApiProperty({
    description: 'Queue name where to send the message.',
  })
  @IsString()
  queueName: string;

  @ApiProperty({
    description: 'Items of the subscription.',
  })
  messageDetail: MessageDetailDto;
}
