import { tools } from '@/application/registry';
import { notFound } from 'next/navigation';
import EnToolPageClient from './EnToolPageClient';

export function generateStaticParams() {
  return tools.filter(t => t.implemented).map(t => ({ tool: t.id }));
}

export function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  return params.then(({ tool: toolId }) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return { title: 'Not Found' };
    return {
      title: tool.name,
      description: tool.description,
    };
  });
}

export default async function EnToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: toolId } = await params;
  const tool = tools.find(t => t.id === toolId && t.implemented);
  if (!tool) notFound();

  return <EnToolPageClient toolId={toolId} toolName={tool.name} toolDescription={tool.description} />;
}
