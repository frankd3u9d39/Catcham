import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { EvidenceService } from './evidence.service';
import {
  AnnotateEvidenceDto,
  ArchiveEvidenceDto,
  TransferCustodyDto,
  UploadEvidenceDto,
} from './dto/evidence.dto';
import { EvidenceQueryDto } from './dto/evidence-query.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';


@ApiBearerAuth()
@ApiTags('Evidence')
@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidence: EvidenceService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.EVIDENCE_READ)
  @ApiOperation({ summary: 'List evidence for a report or investigation' })
  list(@Query() query: EvidenceQueryDto) {
    return this.evidence.list(query, {
      reportId: query.reportId,
      investigationId: query.investigationId,
      includeArchived: query.includeArchived,
    });
  }

  @Post()
  @RequirePermissions(PERMISSIONS.EVIDENCE_UPLOAD)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
        reportId: { type: 'string', format: 'uuid' },
        investigationId: { type: 'string', format: 'uuid' },
        classification: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload an evidence file',
    description:
      'The file type is determined from its magic bytes, not the declared Content-Type. Intake opens the chain of custody.',
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadEvidenceDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.evidence.upload(file, dto, actor, request.ip);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.EVIDENCE_READ)
  @ApiOperation({ summary: 'Evidence metadata, annotations and chain integrity' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.evidence.findById(id, actor, request.ip);
  }

  @Get(':id/custody')
  @RequirePermissions(PERMISSIONS.EVIDENCE_READ)
  @ApiOperation({ summary: 'The full chain of custody with its verification verdict' })
  custodyTrail(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidence.custodyTrail(id);
  }

  @Get(':id/integrity')
  @RequirePermissions(PERMISSIONS.EVIDENCE_READ)
  @ApiOperation({ summary: 'Re-hash the stored file and verify it against intake' })
  integrity(@Param('id', ParseUUIDPipe) id: string) {
    return this.evidence.verifyIntegrity(id);
  }

  @Get(':id/download')
  @RequirePermissions(PERMISSIONS.EVIDENCE_DOWNLOAD)
  @ApiOperation({ summary: 'Stream the file; recorded as a custody event' })
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.evidence.openDownload(id, actor, request.ip);

    response.set({
      'Content-Type': file.mimeType,
      'Content-Length': String(file.sizeBytes),
      // `attachment` keeps the browser from rendering an uploaded document
      // inline on the API origin.
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.fileName)}"`,
      'X-Content-Type-Options': 'nosniff',
    });

    file.stream.pipe(response);
  }

  @Post(':id/custody/transfer')
  @RequirePermissions(PERMISSIONS.EVIDENCE_TRANSFER)
  @ApiOperation({ summary: 'Hand custody to another officer' })
  transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransferCustodyDto,
    @CurrentUser() actor: AuthenticatedUser,
    @Req() request: Request,
  ) {
    return this.evidence.transferCustody(id, dto, actor, request.ip);
  }

  @Post(':id/annotations')
  @RequirePermissions(PERMISSIONS.EVIDENCE_UPLOAD)
  annotate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AnnotateEvidenceDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.evidence.annotate(id, dto, actor);
  }

  @Post(':id/archive')
  @RequirePermissions(PERMISSIONS.EVIDENCE_TRANSFER)
  @ApiOperation({ summary: 'Archive the record and delete the stored file' })
  archive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ArchiveEvidenceDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.evidence.archive(id, dto.reason, actor);
  }
}
