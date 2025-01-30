import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    // Arrange
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    const registerUserData = randomUserData();
    const expectedAlertPopupText = 'User created';

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.alertPopUp).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadUrl();
    const titleLogin = await loginPage.title();
    expect.soft(titleLogin).toContain('Login');

    // Assert
    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });
    const titleWelcome = await welcomePage.title();

    expect(titleWelcome).toContain('Welcome');
  });

  test('not register with incorrect data - non valid email @GAD_R03_04', async ({
    page,
  }) => {
    // Arrange
    const registerPage = new RegisterPage(page);

    const expectedErrorText = 'Please provide a valid email address';

    const registerUserData = randomUserData();
    registerUserData.userEmail = '#$%';

    // Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('not register with incorrect data - email not provided @GAD_R03_04', async ({
    page,
  }) => {
    // Arrange
    const registerPage = new RegisterPage(page);

    const expectedErrorText = 'This field is required';
    const registerUserData = randomUserData();

    // Act
    await registerPage.goto();

    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName);
    await registerPage.userLastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);

    await registerPage.registerButton.click();

    // Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
