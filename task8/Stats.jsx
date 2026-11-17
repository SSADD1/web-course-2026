import { memo } from "react";

/**
 * Счётчики задач.
 *
 * @param {{ active: number, completed: number }} props
 */
function Stats({ active, completed }) {
  return (
    <div className="counter">
      Осталось: <span>{active}</span>, Выполнено: <span>{completed}</span>
    </div>
  );
}

export default memo(Stats);
