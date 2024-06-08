import { print } from '@/utils/lib';

class EmailService {
  async sendEmail({ text }: { text: string }) {
    print.warn('Sending email...');
    print.success(text);
  }
}

export const emailService = new EmailService();
