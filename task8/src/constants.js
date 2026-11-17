/**
 * Конфигурация фильтров и сортировок.
 *
 * Чтобы добавить новый фильтр или сортировку, достаточно добавить
 * один объект в нужный массив — компоненты, хуки и серверные запросы
 * подхватят его автоматически.
 *
 * predicate / compare — работа на клиенте (режим localStorage).
 * query — параметры запроса к json-server (режим сервера).
 */

export const FILTERS = [
  { id: "all", label: "Все", predicate: () => true, query: {} },
  {
    id: "active",
    label: "Активные",
    predicate: (todo) => !todo.completed,
    query: { completed: "false" },
  },
  {
    id: "completed",
    label: "Завершённые",
    predicate: (todo) => todo.completed,
    query: { completed: "true" },
  },
];

export const SORTS = [
  {
    id: "old",
    label: "Сначала старые",
    compare: (a, b) => a.createdAt - b.createdAt,
    query: { _sort: "createdAt", _order: "asc" },
  },
  {
    id: "new",
    label: "Сначала новые",
    compare: (a, b) => b.createdAt - a.createdAt,
    query: { _sort: "createdAt", _order: "desc" },
  },
  {
    id: "az",
    label: "По алфавиту (А→Я)",
    compare: (a, b) => a.text.localeCompare(b.text, "ru"),
    query: { _sort: "text", _order: "asc" },
  },
  {
    id: "za",
    label: "По алфавиту (Я→А)",
    compare: (a, b) => b.text.localeCompare(a.text, "ru"),
    query: { _sort: "text", _order: "desc" },
  },
];

export const SOURCES = [
  { id: "local", label: "Локально (localStorage)" },
  { id: "server", label: "Сервер (json-server)" },
];

export const DEFAULT_FILTER_ID = "all";
export const DEFAULT_SORT_ID = "old";
export const DEFAULT_SOURCE_ID = "local";
