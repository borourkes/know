import { useEditor, EditorContent } from '@tiptap/react';
import { editorConfig } from '@/lib/editor';

type DocumentViewerProps = {
  content: string;
  className?: string;
};

export function DocumentViewer({ content, className }: DocumentViewerProps) {
  const editor = useEditor({
    ...editorConfig,
    content: editorConfig.parseContent(content),
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      <EditorContent editor={editor} className="prose prose-sm max-w-none" />
    </div>
  );
}