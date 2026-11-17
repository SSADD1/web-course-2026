import { memo } from "react";
import { FILTERS } from "../constants.js";

/**
 * Кнопки фильтров. Список берётся из конфигурации FILTERS.
 *
 * @param {{ currentFilter: string, onChange: (id: string) => void }} props
 */
function Filters({ currentFilter, onChange }) {
  return (
    <div className="filters" aria-label="Фильтр задач">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-btn${filter.id === currentFilter ? " active" : ""}`}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default memo(Filters);
