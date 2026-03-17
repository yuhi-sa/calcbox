export type ToolCategory = 'life' | 'health' | 'money' | 'datetime' | 'text' | 'developer';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // SVG path content
  implemented: boolean;
  keywords?: string[]; // Additional search keywords (romaji, aliases, etc.)
}
