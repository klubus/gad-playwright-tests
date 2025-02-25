import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentPage } from '@_src/pages/comment.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { AddCommentView } from '@_src/views/add-comment.view';
import { EditCommentView } from '@_src/views/edit-comment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomArticle();

    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('operate on comments @GAD_R05_01 @GAD_R05_02 @logged', async ({}) => {
    const newCommentData = prepareRandomComment();

    await test.step('create new comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
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
      const expectedCommentUpdatedPopup = 'Comment was updated';

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
  });

  test('user can add more than one comment to article @GAD_R05_03 @logged', async ({}) => {
    const newCommentData = prepareRandomComment();

    await test.step('create first comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';

      // Act
      await articlePage.addCommentButton.click();
      await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('create and verify second comment', async () => {
      const secondCommentBody = await test.step('create comment', async () => {
        const secondCommentData = prepareRandomComment();
        await articlePage.addCommentButton.click();
        await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      await test.step('verify comment', async () => {
        const articleComment = articlePage.getArticleComment(secondCommentBody);
        await expect((await articleComment).body).toHaveText(secondCommentBody);
        await articleComment.link.click();
        await expect(commentPage.commentBody).toHaveText(secondCommentBody);
      });
    });
  });
});
