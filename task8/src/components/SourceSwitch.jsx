import { memo } from "react";
import { SOURCES } from "../constants.js";

/**
 * Переключатель источника данных и кнопка импорта с jsonplaceholder.
 *
 * @param {{ source: string, onChange: (id: string) => void, onImport: () => void }} props
 */
function SourceSwitch({ source, onChange, onImport }) {
  return (
    <div className="source">
      <label>
        Данные:
        <select value={source} onChange={(event) => onChange(event.target.value)}>
          {SOURCES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="secondary-btn" onClick={onImport}>
        Загрузить с jsonplaceholder
      </button>
    </div>
  );
}

export default memo(SourceSwitch);
