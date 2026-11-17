import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FILTERS, SORTS } from "../constants.js";
import {
  buildQuery,
  createTodo,
  fetchPlaceholderTodos,
  fetchTodos,
  patchTodo,
  removeTodo,
} from "../api.js";

const STORAGE_KEY = "todo-react:todos";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadLocalTodos() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const SERVER_ERROR = "Не удалось связаться с json-server (npm run server).";

/**
 * Хранит задачи и отдаёт готовые данные для интерфейса.
 *  - source "local": задачи в стейте + localStorage, фильтр/сортировка на клиенте;
 *  - source "server": задачи на json-server, фильтр/сортировка на сервере.
 * Обработчики стабильны (useCallback) — мемоизированные компоненты не перерисовываются зря.
 *
 * @param {"local"|"server"} source
 * @param {string} filterId
 * @param {string} sortId
 */
export function useTodos(source, filterId, sortId) {
  const [localTodos, setLocalTodos] = useState(loadLocalTodos);
  const [serverAll, setServerAll] = useState([]);
  const [serverVisible, setServerVisible] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [reloadKey, setReloadKey] = useState(0);
  const serverAllRef = useRef([]);

  // Сохраняем список в localStorage при каждом его изменении.
  // Восстановление происходит при загрузке — через ленивую инициализацию useState.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localTodos));
  }, [localTodos]);

  // Загрузка с сервера: перезапрашиваем при смене режима, фильтра, сортировки
  // или после любого изменения данных (reloadKey).
  useEffect(() => {
    if (source !== "server") return;

    const controller = new AbortController();
    setStatus({ loading: true, error: "" });

    Promise.all([
      fetchTodos("", controller.signal),
      fetchTodos(buildQuery(filterId, sortId), controller.signal),
    ])
      .then(([all, visible]) => {
        serverAllRef.current = all;
        setServerAll(all);
        setServerVisible(visible);
        setStatus({ loading: false, error: "" });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setStatus({ loading: false, error: SERVER_ERROR });
      });

    return () => controller.abort();
  }, [source, filterId, sortId, reloadKey]);

  // Клиентские фильтрация и сортировка. Сортируем копию, а не исходный массив.
  const localVisible = useMemo(() => {
    const filter = FILTERS.find((f) => f.id === filterId);
    const sort = SORTS.find((s) => s.id === sortId);
    return [...localTodos].filter(filter.predicate).sort(sort.compare);
  }, [localTodos, filterId, sortId]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const failWith = useCallback((message) => {
    setStatus({ loading: false, error: message });
  }, []);

  const addTodo = useCallback(
    (text, completed) => {
      const todo = { text, completed, createdAt: Date.now() };
      if (source === "local") {
        setLocalTodos((prev) => [...prev, { ...todo, id: makeId() }]);
      } else {
        createTodo(todo).then(reload).catch(() => failWith(SERVER_ERROR));
      }
    },
    [source, reload, failWith],
  );

  const toggleTodo = useCallback(
    (id) => {
      if (source === "local") {
        setLocalTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        );
      } else {
        const todo = serverAllRef.current.find((t) => t.id === id);
        if (!todo) return;
        patchTodo(id, { completed: !todo.completed })
          .then(reload)
          .catch(() => failWith(SERVER_ERROR));
      }
    },
    [source, reload, failWith],
  );

  const deleteTodo = useCallback(
    (id) => {
      if (source === "local") {
        setLocalTodos((prev) => prev.filter((t) => t.id !== id));
      } else {
        removeTodo(id).then(reload).catch(() => failWith(SERVER_ERROR));
      }
    },
    [source, reload, failWith],
  );

  const importTodos = useCallback(async () => {
    try {
      const items = await fetchPlaceholderTodos();
      if (source === "local") {
        setLocalTodos((prev) => [
          ...prev,
          ...items.map((item) => ({ ...item, id: makeId() })),
        ]);
      } else {
        await Promise.all(items.map(createTodo));
        reload();
      }
    } catch {
      failWith("Не удалось загрузить задачи с jsonplaceholder.");
    }
  }, [source, reload, failWith]);

  const isServer = source === "server";
  return {
    todos: isServer ? serverAll : localTodos,
    visibleTodos: isServer ? serverVisible : localVisible,
    status,
    addTodo,
    toggleTodo,
    deleteTodo,
    importTodos,
  };
}
