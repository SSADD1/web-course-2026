import { useMemo, useState } from "react";
import {
  DEFAULT_FILTER_ID,
  DEFAULT_SORT_ID,
  DEFAULT_SOURCE_ID,
} from "./constants.js";
import { useTodos } from "./hooks/useTodos.js";
import TodoForm from "./components/TodoForm.jsx";
import Filters from "./components/Filters.jsx";
import SortSelect from "./components/SortSelect.jsx";
import SourceSwitch from "./components/SourceSwitch.jsx";
import Stats from "./components/Stats.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  const [source, setSource] = useState(DEFAULT_SOURCE_ID);
  const [filterId, setFilterId] = useState(DEFAULT_FILTER_ID);
  const [sortId, setSortId] = useState(DEFAULT_SORT_ID);

  // Все задачи и их изменение живут здесь (через хук useTodos).
  const { todos, visibleTodos, status, addTodo, toggleTodo, deleteTodo, importTodos } =
    useTodos(source, filterId, sortId);

  const counts = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return { active: todos.length - completed, completed };
  }, [todos]);

  return (
    <main className="container">
      <h1>Список задач</h1>

      <SourceSwitch source={source} onChange={setSource} onImport={importTodos} />
      {status.error && <p className="warning">{status.error}</p>}

      <TodoForm onAdd={addTodo} />
      <Stats active={counts.active} completed={counts.completed} />

      <div className="toolbar">
        <Filters currentFilter={filterId} onChange={setFilterId} />
        <SortSelect currentSort={sortId} onChange={setSortId} />
      </div>

      {status.loading && <p className="empty">Загрузка...</p>}
      <TodoList todos={visibleTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </main>
  );
}
