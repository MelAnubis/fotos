import { UserResponseDto, UserService } from '@app/domain';
import { Command, CommandRunner, InquirerService, Question, QuestionSet } from 'nest-commander';

@Command({
  name: 'reset-admin-password',
  description: 'Reset the admin password',
})
export class ResetAdminPasswordCommand extends CommandRunner {
  constructor(
    private userService: UserService,
    private readonly inquirer: InquirerService,
  ) {
    super();
  }

  ask = async (admin: UserResponseDto) => {
    const { id, oauthId, email, name } = admin;
    console.log(`Found Admin:
- ID=${id}
- OAuth ID=${oauthId}
- Email=${email}
- Name=${name}`);

    const { password } = await this.inquirer.ask<{ password: string }>('prompt-password', {});
    return password;
  };

  async run(): Promise<void> {
    try {
      await this.userService.resetAdminPassword(this.ask);

      console.log(`The admin password has been updated.`);
    } catch (error) {
      console.error(error);
      console.error('Unable to reset admin password');
    }
  }
}

@QuestionSet({ name: 'prompt-password' })
export class PromptPasswordQuestions {
  @Question({
    message: 'Please choose a new password (optional)',
    name: 'password',
  })
  parsePassword(value: string) {
    return value;
  }
}
