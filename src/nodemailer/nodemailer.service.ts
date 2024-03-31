import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    } as nodemailer.TransportOptions | nodemailer.Transport<unknown>);

    const verificationUrl = `${process.env.API_URL}/auth/verify-email/${email}?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Cryptic email verification',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .token {
            font-size: 24px;
            color: #333;
            font-weight: bold;
          }
          .verify-link {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            border: 1px solid #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Thank you for signing up! Please verify your email address to continue.</p>
          <p>Your verification token is:</p>
          <p class="token">${token}</p>
          <p>You can also click the link below to verify your email address:</p>
          <a href="${verificationUrl}" class="verify-link">Verify email</a>
        </div>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
