import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import NotifmeSdk from 'notifme-sdk';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  // Email default subject
  subject: string;

  // SMTP Connection Setting
  emailFrom: string;
  username: string;
  password: string;
  host: string;
  port: number;
  requireTLS: boolean;

  notifme: NotifmeSdk;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Notification service init');
    this.subject = this.configService.get<string>('EMAIL_DEFAULT_SUBJECT');
    this.emailFrom = this.configService.get<string>('SMTP_EMAIL_FROM');
    this.username = this.configService.get<string>('SMTP_USERNAME');
    this.password = this.configService.get<string>('SMTP_PASSWORD');
    this.host = this.configService.get<string>('SMTP_HOST');
    this.port = this.configService.get<number>('SMTP_PORT');
    this.requireTLS = this.configService.get<boolean>('SMTP_ENABLE_START_TLS');

    this.notifme = new NotifmeSdk({
      useNotificationCatcher: false,
      channels: {
        email: {
          providers: [
            {
              type: 'smtp',
              host: this.host,
              port: this.port,
              requireTLS: this.requireTLS,
              auth: {
                user: this.username,
                pass: this.password,
              },
              tls: {
                rejectUnauthorized: false,
              },
              connectionTimeout: 5000,
              debug: false,
              logger: true,
            },
          ],
        },
      },
    });
    this.logger.log('Notification service init success');
  }

  async sendEmail(
    to: string,
    message: string,
    subject: string = null,
    from: string = null,
  ) {
    const sendEmailRes = await this.notifme.send({
      email: {
        from: from || this.emailFrom,
        to,
        subject: subject || this.subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          ${message}
        </body>
        </html>
        `,
      },
    });

    return sendEmailRes;
  }
}
