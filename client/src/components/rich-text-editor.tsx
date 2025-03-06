import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  List,
  ListOrdered,
  Quote
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  className?: string;
};

export function RichTextEditor({ content, onChange, className }: RichTextEditorProps) {
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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleStyle = (active: boolean) =>
    cn(
      "data-[state=on]:bg-muted data-[state=on]:text-muted-foreground",
      active && "bg-muted text-muted-foreground"
    );

  return (
    <div className={className}>
      <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-background sticky top-0">
        <Toggle
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          className={toggleStyle(editor.isActive('bold'))}
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          className={toggleStyle(editor.isActive('italic'))}
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          className={toggleStyle(editor.isActive('underline'))}
          size="sm"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          className={toggleStyle(editor.isActive({ textAlign: 'left' }))}
          size="sm"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          className={toggleStyle(editor.isActive({ textAlign: 'center' }))}
          size="sm"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          className={toggleStyle(editor.isActive({ textAlign: 'right' }))}
          size="sm"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleStyle(editor.isActive('bulletList'))}
          size="sm"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleStyle(editor.isActive('orderedList'))}
          size="sm"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          className={toggleStyle(editor.isActive('blockquote'))}
          size="sm"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter link URL');
            if (url) {
              editor
                .chain()
                .focus()
                .setLink({ href: url })
                .run();
            }
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            // TODO: Implement file attachment
            alert('File attachment coming soon!');
          }}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}
