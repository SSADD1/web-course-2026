/* View: отображение данных и управление элементами интерфейса. */
(() => {
  'use strict';

  class PostsView {
    constructor() {
      this.postsList = document.querySelector('#posts-list');
      this.searchInput = document.querySelector('#search-input');
      this.resultsCount = document.querySelector('#results-count');
      this.loadingIndicator = document.querySelector('#loading-indicator');
      this.errorMessage = document.querySelector('#error-message');
      this.endMessage = document.querySelector('#end-message');
      this.retryButton = document.querySelector('#retry-button');
      this.sentinel = document.querySelector('#scroll-sentinel');
    }

    createPostCard(post) {
      const article = document.createElement('article');
      article.className = 'post-card';

      const topLine = document.createElement('div');
      topLine.className = 'post-topline';

      const id = document.createElement('span');
      id.className = 'post-id';
      id.textContent = `Пост #${post.id}`;

      const author = document.createElement('span');
      author.className = 'post-author';
      author.textContent = `Автор: ${post.userId}`;

      const title = document.createElement('h2');
      title.textContent = post.title;

      const body = document.createElement('p');
      body.textContent = post.body;

      topLine.append(id, author);
      article.append(topLine, title, body);
      return article;
    }

    appendPosts(posts) {
      const fragment = document.createDocumentFragment();
      posts.forEach(post => fragment.append(this.createPostCard(post)));
      this.postsList.append(fragment);
    }

    renderPosts(posts) {
      const fragment = document.createDocumentFragment();
      posts.forEach(post => fragment.append(this.createPostCard(post)));
      this.postsList.replaceChildren(fragment);
    }

    setLoading(isLoading) {
      this.loadingIndicator.hidden = !isLoading;
      this.retryButton.hidden = true;
    }

    showError(message) {
      this.errorMessage.textContent = message;
      this.errorMessage.hidden = false;
      this.retryButton.hidden = false;
    }

    clearError() {
      this.errorMessage.textContent = '';
      this.errorMessage.hidden = true;
      this.retryButton.hidden = true;
    }

    setEndReached(hasMore) {
      this.endMessage.hidden = hasMore;
    }

    setResultsCount(visibleCount, loadedCount, hasMore, query) {
      if (query.trim()) {
        this.resultsCount.textContent = `Найдено: ${visibleCount} из ${loadedCount} загруженных постов`;
      } else {
        this.resultsCount.textContent = hasMore
          ? `Загружено ${loadedCount} из 100 постов`
          : `Все посты загружены: ${loadedCount} из 100`;
      }
    }

    getSearchQuery() {
      return this.searchInput.value;
    }
  }

  window.PostsView = PostsView;
})();
