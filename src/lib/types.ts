export type ToolCategory = 'life' | 'health' | 'money' | 'datetime' | 'text';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // SVG path content
  implemented: boolean;
}
