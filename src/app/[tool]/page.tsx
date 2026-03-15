import { tools } from '@/lib/tools-registry';
import { notFound } from 'next/navigation';
import ToolPageClient from './ToolPageClient';

export function generateStaticParams() {
  return tools.filter(t => t.implemented).map(t => ({ tool: t.id }));
}

export function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  // We use a sync approach - metadata can be async in Next.js 15
  return params.then(({ tool: toolId }) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return { title: 'Not Found' };
    return {
      title: tool.name,
      description: tool.description,
    };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: toolId } = await params;
  const tool = tools.find(t => t.id === toolId && t.implemented);
  if (!tool) notFound();

  return <ToolPageClient toolId={toolId} toolName={tool.name} toolDescription={tool.description} />;
}
