import { Injectable } from '@nestjs/common';

@Injectable()
export class CaseAssignmentService {
  canAssignCase(supervisorId: string, caseId: string): boolean {
    return true;
  }
}
