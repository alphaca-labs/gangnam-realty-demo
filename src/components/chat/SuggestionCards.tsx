interface Suggestion {
  title: string;
  icon: string;
}

interface SuggestionCardsProps {
  suggestions: Suggestion[];
  onSelect: (title: string) => void;
}

export default function SuggestionCards({ suggestions, onSelect }: SuggestionCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion.title)}
          className="p-4 bg-sidebar rounded-xl hover:bg-sidebar-hover transition-colors text-left border border-border group"
        >
          <div className="text-2xl mb-2">{suggestion.icon}</div>
          <div className="font-medium text-text-primary group-hover:text-primary transition-colors">
            {suggestion.title}
          </div>
        </button>
      ))}
    </div>
  );
}
