import { useEditor, EditorContent } from '@tiptap/react';
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
    extensions: [
      StarterKit,
      Image,
      Link,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
    ],
    content: (() => {
      try {
        // Try parsing as JSON first
        return JSON.parse(content);
      } catch {
        // If parsing fails, treat as HTML content
        return content || '';
      }
    })(),
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
