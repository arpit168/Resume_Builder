import { DesignEditorView } from "@/components/builder/design/DesignEditorView";

export default async function DesignPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const resolvedParams = await params;
  return <DesignEditorView resumeId={resolvedParams.resumeId} />;
}
