import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';


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
