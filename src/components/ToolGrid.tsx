'use client';

import { ToolDefinition } from '@/lib/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: ToolDefinition[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function ToolGrid({ tools, favorites, onToggleFavorite }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        該当するツールが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          isFavorite={favorites.includes(tool.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
