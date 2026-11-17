import { FILTERS, SORTS } from "./constants.js";

const API_URL = "http://localhost:3001/todos";
const PLACEHOLDER_URL = "https://jsonplaceholder.typicode.com/todos?_limit=10";

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Строка запроса: фильтрация и сортировка выполняются на сервере.
 * @param {string} filterId
 * @param {string} sortId
 */
export function buildQuery(filterId, sortId) {
  const filter = FILTERS.find((f) => f.id === filterId);
  const sort = SORTS.find((s) => s.id === sortId);
  return new URLSearchParams({ ...filter?.query, ...sort?.query }).toString();
}

export function fetchTodos(query = "", signal) {
  return request(query ? `${API_URL}?${query}` : API_URL, { signal });
}

export function createTodo(todo) {
  return request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
}

export function patchTodo(id, patch) {
  return request(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export function removeTodo(id) {
  return request(`${API_URL}/${id}`, { method: "DELETE" });
}

/** Загружает задачи с jsonplaceholder и приводит их к формату приложения. */
export async function fetchPlaceholderTodos() {
  const data = await request(PLACEHOLDER_URL);
  const now = Date.now();
  return data.map((item, index) => ({
    text: item.title,
    completed: item.completed,
    createdAt: now + index,
  }));
}
