import { useEditor, EditorContent } from '@tiptap/react';
import { editorConfig } from './rich-text-editor';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';

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