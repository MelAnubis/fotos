import { DomainModule } from '@app/domain';
import { InfraModule } from '@app/infra';
import { Module } from '@nestjs/common';
import { ListUsersCommand } from './commands/list-users.command';
import { DisableOauthAutoRedirect, EnableOauthAutoRedirect } from './commands/oauth-redirect';
import { DisablePasswordLoginCommand, EnablePasswordLoginCommand } from './commands/password-login';
import { PromptPasswordQuestions, ResetAdminPasswordCommand } from './commands/reset-admin-password.command';

@Module({
  imports: [InfraModule, DomainModule],
  providers: [
    ResetAdminPasswordCommand,
    PromptPasswordQuestions,
    EnablePasswordLoginCommand,
    DisablePasswordLoginCommand,
    EnableOauthAutoRedirect,
    DisableOauthAutoRedirect,
    ListUsersCommand,
  ],
})
export class AppModule {}
