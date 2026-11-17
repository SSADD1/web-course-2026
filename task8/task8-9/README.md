# todo-react (task8-9)

Список задач на React + Vite (функциональные компоненты и хуки).

## Запуск

```bash
npm install
npm run dev        # приложение: http://localhost:5173
npm run server     # (опционально) json-server: http://localhost:3001
```

## Структура

- `src/App.jsx` — корневой компонент: режим данных, фильтр, сортировка; собирает дочерние компоненты.
- `src/hooks/useTodos.js` — задачи, их изменение, localStorage (`useEffect`), загрузка с сервера (`fetch` в `useEffect`), импорт с jsonplaceholder.
- `src/components/` — `TodoForm`, `Filters`, `SortSelect`, `SourceSwitch`, `Stats`, `TodoList`, `TodoItem` (все обёрнуты в `memo`).
- `src/constants.js` — конфигурация фильтров и сортировок.
- `src/api.js` — запросы к json-server и jsonplaceholder.
- `db.json` — база json-server.

## Как добавить фильтр / сортировку

Добавить один объект в `FILTERS` или `SORTS` в `src/constants.js`
(`predicate`/`compare` для клиента, `query` для сервера). Больше ничего менять не нужно.

## Мемоизация

- Текст в поле ввода — локальный стейт `TodoForm`, поэтому набор не перерисовывает список.
- Обработчики из `useTodos` обёрнуты в `useCallback` и не зависят от списка задач (используются функциональные обновления стейта).
- `React.memo` на компонентах: при изменении одной задачи перерисовывается только её `TodoItem`; `useMemo` — для счётчиков и клиентской фильтрации/сортировки.

## Режимы данных

- **Локально**: задачи в стейте, сохраняются в localStorage при каждом изменении и восстанавливаются при загрузке; фильтр и сортировка — на клиенте (`[...todos].filter(...).sort(...)`, исходный массив не мутируется).
- **Сервер**: задачи в `db.json`, чтение через `fetch` в `useEffect`; фильтр (`completed=...`) и сортировка (`_sort`, `_order`) выполняет json-server. Сортировка по тексту на json-server чувствительна к регистру.
- Кнопка «Загрузить с jsonplaceholder» добавляет 10 задач в текущий режим.
