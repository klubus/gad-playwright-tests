import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { AddCommentModel } from '../../src/models/comment.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('create new comment @GAD_R05_01 @GAD_R05_02 @GAD_R05_03', async ({}) => {
    // Create new comment
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created';
    const expectedCommentUpdatedPopup = 'Comment was updated';

    const newCommentData = prepareRandomComment();

    await test.step('create new comment', async () => {
      // Arrange
      const expectedAddNewCommentHeader = 'Add New Comment';

      // Act
      await articlePage.addCommentButton.click();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddNewCommentHeader);
      await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('verify comment', async () => {
      // Act
      const articleComment = articlePage.getArticleComment(newCommentData.body);
      await expect((await articleComment).body).toHaveText(newCommentData.body);
      await articleComment.link.click();

      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);
    });

    let editCommentData: AddCommentModel;

    await test.step('update comment', async () => {
      // Arrange
      editCommentData = prepareRandomComment();

      // Act
      await commentPage.editButton.click();
      await editCommentView.updateComment(editCommentData);

      // Assert
      await expect
        .soft(commentPage.commentBody)
        .toHaveText(editCommentData.body);
      await expect(commentPage.alertPopup).toHaveText(
        expectedCommentUpdatedPopup,
      );
    });

    await test.step('verify updated comment in article page', async () => {
      // Act
      await commentPage.returnLink.click();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );

      // Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });

    await test.step('create and verify second comment', async () => {
      // Arrange
      const secondCommentData = prepareRandomComment();

      // Act
      await articlePage.addCommentButton.click();
      await addCommentView.createComment(secondCommentData);

      // Assert
      const articleComment = articlePage.getArticleComment(
        secondCommentData.body,
      );
      await expect((await articleComment).body).toHaveText(
        secondCommentData.body,
      );
      await articleComment.link.click();
      await expect(commentPage.commentBody).toHaveText(secondCommentData.body);
    });
  });
});
