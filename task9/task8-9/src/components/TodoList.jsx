import { memo } from "react";
import TodoItem from "./TodoItem.jsx";

/**
 * Список задач (уже отфильтрованный и отсортированный в App).
 *
 * @param {{
 *   todos: Array<{ id: string|number, text: string, completed: boolean }>,
 *   onToggle: (id: string|number) => void,
 *   onDelete: (id: string|number) => void
 * }} props
 */
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty">Задач нет</p>;
  }

  return (
    <ul className="task-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default memo(TodoList);
