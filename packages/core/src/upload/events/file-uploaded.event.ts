import { DomainEvent } from '../../events/domain-event.base';

export class FileUploadedEvent extends DomainEvent {
  constructor(public readonly fileKey: string, public readonly bucket: string, public readonly checksum: string) {
    super();
  }
}
