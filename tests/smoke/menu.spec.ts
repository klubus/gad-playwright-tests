import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import test, { expect } from '@playwright/test';

test.describe('Verify menu main pages', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);

    // Act
    articlesPage.goto();
    await articlesPage.mainMenu.commentsButton.click();
    const title = await commentsPage.title();

    // Assert
    expect(title).toContain('Comments');
  });

  test('articles button navigates to articles page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);

    // Act
    commentsPage.goto();
    await commentsPage.mainMenu.articlesButton.click();
    const title = await articlesPage.title();

    // Assert
    expect(title).toContain('Articles');
  });

  test('home button navigates to home page @GAD-R01-03', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    const homePage = new HomePage(page);

    // Act
    articlesPage.goto();
    await articlesPage.mainMenu.homePage.click();
    const title = await homePage.title();

    // Assert
    expect(title).toContain('GAD');
  });
});
