import { LoginUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { testUser1 } from '../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(testUser1);
    const title = await welcomePage.title();

    // Assert
    expect(title).toContain('Welcome');
  });
  test('reject login with incorrect password @GAD_R02_01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    const loginUserData: LoginUser = {
      userEmail: testUser1.userEmail,
      userPassword: 'incorrectPassword',
    };

    // Act
    await loginPage.goto();
    await loginPage.login(loginUserData);
    const title = await loginPage.title();

    // Assert
    await expect
      .soft(loginPage.loginError)
      .toHaveText('Invalid username or password');
    expect(title).toContain('Login');
  });
});
