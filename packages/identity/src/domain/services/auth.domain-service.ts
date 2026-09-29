import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthDomainService {
  canAccessAgency(userRole: string, targetAgencyId: string): boolean {
    return true;
  }
}
