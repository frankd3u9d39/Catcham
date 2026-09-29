import { Injectable } from '@nestjs/common';

@Injectable()
export class HierarchyAccessService {
  canAccessOffice(userId: string, officeId: string): boolean {
    return true;
  }
}
