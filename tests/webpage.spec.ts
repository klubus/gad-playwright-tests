import { ArticlesPage } from '../src/pages/articles.page';
import { CommentsPage } from '../src/pages/comments.page';
import { HomePage } from '../src/pages/home.page';
import test, { expect } from '@playwright/test';

test.describe('Verify service main pages', () => {
  test('home page title', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);

    // Act
    await homePage.goto();
    const title = await homePage.title();

    // Assert
    expect(title).toContain('GAD');
  });

  test('article page title', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);

    // Act
    await articlesPage.goto();
    const title = await articlesPage.title();

    // Assert
    expect(title).toContain('Articles');
  });

  test('comments page title', async ({ page }) => {
    // Arrange
    const commentsPage = new CommentsPage(page);

    // Act
    await commentsPage.goto();
    const title = await commentsPage.title();

    // Assert
    expect(title).toContain('Comments');
  });
});
