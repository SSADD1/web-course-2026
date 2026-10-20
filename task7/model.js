/* Model: работа с API и хранение загруженных данных. */
(() => {
  'use strict';

  const API_URL = 'https://jsonplaceholder.typicode.com/posts';
  const PAGE_SIZE = 10;
  const TOTAL_POSTS = 100;

  class PostsModel {
    constructor() {
      this.posts = [];
      this.nextStart = 0;
      this.isLoading = false;
      this.hasMore = true;
    }

    get loadedCount() {
      return this.posts.length;
    }

    get filteredPosts() {
      return this.posts;
    }

    async loadNextBatch() {
      if (this.isLoading || !this.hasMore) {
        return { posts: [], hasMore: this.hasMore, skipped: true };
      }

      this.isLoading = true;
      const start = this.nextStart;
      const limit = Math.min(PAGE_SIZE, TOTAL_POSTS - start);

      try {
        const response = await fetch(`${API_URL}?_start=${start}&_limit=${limit}`);

        if (!response.ok) {
          throw new Error(`Сервер ответил ошибкой (${response.status}).`);
        }

        const batch = await response.json();
        if (!Array.isArray(batch)) {
          throw new Error('Сервер вернул данные в неожиданном формате.');
        }

        // Сдвигаем указатель только после успешного ответа, чтобы можно было повторить запрос.
        const existingIds = new Set(this.posts.map(post => post.id));
        const uniqueBatch = batch.filter(post => !existingIds.has(post.id));
        this.posts.push(...uniqueBatch);
        this.nextStart += batch.length;
        this.hasMore = this.nextStart < TOTAL_POSTS && batch.length > 0;

        return { posts: uniqueBatch, hasMore: this.hasMore, skipped: false };
      } catch (error) {
        console.error('Не удалось загрузить посты:', error);
        throw new Error(error instanceof TypeError
          ? 'Не удалось подключиться к серверу. Проверьте интернет-соединение и попробуйте снова.'
          : (error.message || 'Произошла ошибка при загрузке постов.'));
      } finally {
        this.isLoading = false;
      }
    }

    filterByTitle(query) {
      const normalizedQuery = query.trim().toLocaleLowerCase();
      if (!normalizedQuery) return [...this.posts];

      return this.posts.filter(post =>
        String(post.title || '').toLocaleLowerCase().includes(normalizedQuery)
      );
    }
  }

  window.PostsModel = PostsModel;
})();
