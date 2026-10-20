/* Controller: связывает модель и представление, обрабатывает поиск и бесконечную прокрутку. */
(() => {
  'use strict';

  class PostsController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.searchTimer = null;
      this.debounceDelay = 300;
      this.observer = null;
      this.isRequesting = false;
    }

    init() {
      this.bindEvents();
      this.setupInfiniteScroll();
      this.loadNextBatch();
    }

    bindEvents() {
      this.view.searchInput.addEventListener('input', () => {
        window.clearTimeout(this.searchTimer);
        this.searchTimer = window.setTimeout(() => this.applyFilter(), this.debounceDelay);
      });

      this.view.retryButton.addEventListener('click', () => this.loadNextBatch());
    }

    setupInfiniteScroll() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(entries => {
          const sentinelVisible = entries.some(entry => entry.isIntersecting);
          if (sentinelVisible && this.model.hasMore && !this.model.isLoading) {
            this.loadNextBatch();
          }
        }, { root: null, rootMargin: '200px 0px', threshold: 0 });

        this.observer.observe(this.view.sentinel);
      } else {
        // Резервный вариант для браузеров без IntersectionObserver.
        window.addEventListener('scroll', () => {
          const nearBottom = window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 200;
          if (nearBottom && this.model.hasMore && !this.model.isLoading) {
            this.loadNextBatch();
          }
        }, { passive: true });
      }
    }

    async loadNextBatch() {
      if (this.isRequesting || !this.model.hasMore) return;

      this.isRequesting = true;
      this.view.clearError();
      this.view.setLoading(true);

      try {
        const result = await this.model.loadNextBatch();
        if (result.posts.length) {
          // При активном поиске сохраняем текущий фильтр после добавления новой порции.
          this.applyFilter();
        }
        this.view.setEndReached(this.model.hasMore);
        this.view.setResultsCount(
          this.model.filterByTitle(this.view.getSearchQuery()).length,
          this.model.loadedCount,
          this.model.hasMore,
          this.view.getSearchQuery()
        );
      } catch (error) {
        this.view.showError(error.message);
      } finally {
        this.isRequesting = false;
        this.view.setLoading(false);
        // Если первая порция короче высоты окна, sentinel может оставаться видимым.
        // Повторная проверка observer обычно сработает автоматически; этот вызов помогает на коротких страницах.
        if (this.model.hasMore && this.observer) {
          this.observer.unobserve(this.view.sentinel);
          this.observer.observe(this.view.sentinel);
        }
      }
    }

    applyFilter() {
      const query = this.view.getSearchQuery();
      const filtered = this.model.filterByTitle(query);
      this.view.renderPosts(filtered);
      this.view.setResultsCount(filtered.length, this.model.loadedCount, this.model.hasMore, query);
      this.view.setEndReached(this.model.hasMore);

      // Если поисковая выдача пуста, но данные ещё есть, прокрутка всё равно может загружать следующие порции.
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const model = new window.PostsModel();
    const view = new window.PostsView();
    const controller = new PostsController(model, view);
    controller.init();
  });
})();
