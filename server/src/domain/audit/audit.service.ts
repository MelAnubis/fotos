import { Inject, Injectable, Logger } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { IAuditRepository } from '.';
import { AuthUserDto } from '..';
import { AuditResponseDto } from './audit-response.dto';

@Injectable()
export class AuditService {
  private logger = new Logger(AuditService.name);

  constructor(@Inject(IAuditRepository) private repository: IAuditRepository) {}

  async getNewestRecordsForOwnerSince(authUser: AuthUserDto, since: Date): Promise<AuditResponseDto[] | null> {
    const count = await this.repository.countOlderForOwner(authUser.id, since);
    if (count == 0) return null;
    try {
      const entries = await this.repository.getNewestForOwnerSince(authUser.id, since);
      return entries.reverse();
    } catch (e) {
      return null;
    }
  }

  async handleCleanup(): Promise<boolean> {
    const date = DateTime.now().minus(Duration.fromObject({ days: 100 }));
    await this.repository.cleanOldEntries(date.toJSDate());
    return true;
  }
}
