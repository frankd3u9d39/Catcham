import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InvestigationsController } from './controllers/investigations.controller';
import { AssignmentsController } from './controllers/assignments.controller';
import { TasksController } from './controllers/tasks.controller';
import { NotesController } from './controllers/notes.controller';
import { TimelineController } from './controllers/timeline.controller';
import { EscalationsController } from './controllers/escalations.controller';
import { CreateInvestigationHandler } from './application/handlers/create-investigation.handler';
import { CaseAssignmentService } from './domain/services/case-assignment.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    InvestigationsController,
    AssignmentsController,
    TasksController,
    NotesController,
    TimelineController,
    EscalationsController,
  ],
  providers: [CreateInvestigationHandler, CaseAssignmentService],
  exports: [CaseAssignmentService],
})
export class InvestigationModule {}
