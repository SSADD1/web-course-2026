import { memo, useRef, useState } from "react";

/**
 * Форма добавления задачи: поле ввода, выбор типа (выполненная/нет), кнопка.
 * Текст и предупреждение — локальное состояние формы, поэтому ввод
 * перерисовывает только эту форму, а не весь список.
 *
 * @param {{ onAdd: (text: string, completed: boolean) => void }} props
 */
function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [completed, setCompleted] = useState(false);
  const [warning, setWarning] = useState("");
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();

    if (trimmed === "") {
      setWarning("Введите текст задачи!");
      inputRef.current.focus();
      return;
    }

    setWarning("");
    onAdd(trimmed, completed);
    setText("");
    inputRef.current.focus();
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="task-input"
          placeholder="Введите задачу..."
          autoComplete="off"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <select
          aria-label="Тип задачи"
          value={completed ? "completed" : "active"}
          onChange={(event) => setCompleted(event.target.value === "completed")}
        >
          <option value="active">Невыполненная</option>
          <option value="completed">Выполненная</option>
        </select>
        <button type="submit">Добавить</button>
      </form>
      <p className="warning" aria-live="polite">
        {warning}
      </p>
    </>
  );
}

export default memo(TodoForm);
