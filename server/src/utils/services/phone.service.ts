import { print } from '@/utils/lib';

class PhoneService {
  async sendSms({ text }: { text: string }) {
    print.warn('Sending sms...');
    print.success(text);
  }
}

export const phoneService = new PhoneService();
