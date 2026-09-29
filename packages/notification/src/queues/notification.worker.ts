export class NotificationWorker {
  async processJob(job: any) {
    return { status: 'processed' };
  }
}
