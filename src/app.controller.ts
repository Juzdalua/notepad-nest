import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Twilio } from 'twilio';
import { PhoneNumberValidationError } from 'twilio/lib/rest/lookups/v2/phoneNumber';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService) {}

  @Get()
  async getHello(str: string): Promise<any> {
    const accountSid = this.configService.get<string>("TWILIO_SID");
    const authToken = this.configService.get<string>("TWILIO_TOKEN");
    const client = new Twilio(accountSid, authToken);

    // const verifyCode = await client.verify.v2.services('VA11e8d2edad6c669bbd698a24a9f78148').verifications.create({ to: '+821045703671', channel: 'sms' });
    // console.log(verifyCode);

    const lookupFree = await client.lookups.v2.phoneNumbers('+821012341234').fetch();

    if (!lookupFree.valid) {
      const validError: PhoneNumberValidationError[] = lookupFree.validationErrors;
      if (validError.includes('TOO_SHORT') || validError.includes('TOO_LONG') || validError.includes('NOT_A_NUMBER') || validError.includes('INVALID_LENGTH') || validError.includes("INVALID_COUNTRY_CODE")) {
        return validError;
      }
      if(validError.includes("INVALID_BUT_POSSIBLE")){
        return validError;
      }
    }

    return lookupFree;
    return this.appService.getHello();
  }
}
