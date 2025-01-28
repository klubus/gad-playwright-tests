import { RegisterUser } from '../models/user.model';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  url = '/register.html';
  userFirstName = this.page.getByTestId('firstname-input');
  userLastName = this.page.getByTestId('lastname-input');
  userEmailInput = this.page.getByTestId('email-input');
  userPasswordInput = this.page.getByTestId('password-input');
  registerButton = this.page.getByTestId('register-button');

  alertPopUp = this.page.getByTestId('alert-popup');

  constructor(page: Page) {
    super(page);
  }

  async register(registerUserData: RegisterUser): Promise<void> {
    await this.userFirstName.fill(registerUserData.userFirstName);
    await this.userLastName.fill(registerUserData.userLastName);
    await this.userEmailInput.fill(registerUserData.userEmail);
    await this.userPasswordInput.fill(registerUserData.userPassword);
    await this.registerButton.click();
  }
}
