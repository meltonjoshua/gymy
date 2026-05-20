'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { workoutTemplates } from '@/data/workout-templates';
import TemplateDetail from '@/components/templates/TemplateDetail';

export default function TemplateDetailPage() {
  const params = useParams();
  const template = workoutTemplates.find((t) => t.id === (params.id as string));

  if (!template) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        <p>Template not found</p>
        <Link href="/templates" className="text-emerald-400 hover:underline mt-2 inline-block">Back to templates</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <TemplateDetail template={template} />
    </div>
  );
}