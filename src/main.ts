import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

/**
 * Gets the cors origin to respect the expressjs cors which is behind scenes in NestJs
 * @return Array[string]
 * @link https://github.com/expressjs/cors#configuration-options
 */
export const getCORSConfig = () => {
    const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN;
    return CORS_ALLOW_ORIGIN.split(',');
};

const SERVER_PORT_LISTENING = process.env.SERVER_PORT_LISTENING;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
        logger: ['error', 'warn', 'log'],
        cors: {
            origin: getCORSConfig(),
            credentials: true,
        },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Notification service API')
        .setDescription(
            'Service to manage notifications related to existing users with a account to receive updates.',
        )
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
    await app.listen(SERVER_PORT_LISTENING);
}

bootstrap();
