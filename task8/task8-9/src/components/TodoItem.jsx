import { memo } from "react";

/**
 * Одна задача. Собственного состояния нет — всё приходит через props,
 * изменения делаются вызовом функций, переданных из App.
 *
 * @param {{
 *   todo: { id: string|number, text: string, completed: boolean },
 *   onToggle: (id: string|number) => void,
 *   onDelete: (id: string|number) => void
 * }} props
 */
function TodoItem({ todo, onToggle, onDelete }) {
  const { id, text, completed } = todo;

  return (
    <li className={`task${completed ? " completed" : ""}`}>
      <span className="task-text">{text}</span>
      <button type="button" className="complete-btn" onClick={() => onToggle(id)}>
        {completed ? "Вернуть" : "Выполнено"}
      </button>
      <button type="button" className="delete-btn" onClick={() => onDelete(id)}>
        Удалить
      </button>
    </li>
  );
}

export default memo(TodoItem);
