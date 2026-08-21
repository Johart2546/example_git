export default function TagFilter({ tags, selected, onToggle }) {
  const selectedSet = new Set(selected || []);

  return (
    <div className="tag-filter" role="group" aria-label="กรองตามอุปกรณ์">
      {tags.map((tag) => {
        const isSelected = selectedSet.has(tag);
        return (
          <button
            key={tag}
            type="button"
            className={`chip chip--toggle${isSelected ? ' chip--selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onToggle(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
