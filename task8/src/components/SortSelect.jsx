import { memo } from "react";
import { SORTS } from "../constants.js";

/**
 * Выпадающий список сортировки. Варианты берутся из конфигурации SORTS.
 *
 * @param {{ currentSort: string, onChange: (id: string) => void }} props
 */
function SortSelect({ currentSort, onChange }) {
  return (
    <label className="sort">
      Сортировка:
      <select value={currentSort} onChange={(event) => onChange(event.target.value)}>
        {SORTS.map((sort) => (
          <option key={sort.id} value={sort.id}>
            {sort.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default memo(SortSelect);
