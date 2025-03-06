import { useEditor, EditorContent } from '@tiptap/react';
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
  Quote,
  Video
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { editorConfig } from "@/lib/editor";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  className?: string;
};

export function RichTextEditor({ content, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    ...editorConfig,
    content: editorConfig.parseContent(content),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
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

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        }
      };
      reader.readAsDataURL(file);
    } else if (type === 'video' && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().insertContent([{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: ' '
            }]
          }, {
            type: 'paragraph',
            content: [{
              type: 'text',
              marks: [{
                type: 'textStyle',
                attrs: { class: 'w-full aspect-video rounded-lg' }
              }],
              text: `[Video: ${file.name}]`
            }]
          }]).run();

          const video = document.createElement('video');
          video.src = e.target.result;
          video.controls = true;
          video.className = 'w-full aspect-video rounded-lg';
          const selection = editor.view.state.selection;
          const pos = selection.$to.pos;
          editor.view.dispatch(
            editor.view.state.tr.insert(
              pos,
              editor.schema.nodes.paragraph.create(
                null,
                editor.schema.text(video.outerHTML)
              )
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().insertContent([{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: ' '
            }]
          }, {
            type: 'paragraph',
            content: [{
              type: 'text',
              marks: [{
                type: 'textStyle',
                attrs: { class: 'w-full aspect-video rounded-lg' }
              }],
              text: `[Video: ${file.name}]`
            }]
          }]).run();

          const video = document.createElement('video');
          video.src = e.target.result;
          video.controls = true;
          video.className = 'w-full aspect-video rounded-lg';
          const selection = editor.view.state.selection;
          const pos = selection.$to.pos;
          editor.view.dispatch(
            editor.view.state.tr.insert(
              pos,
              editor.schema.nodes.paragraph.create(
                null,
                editor.schema.text(video.outerHTML)
              )
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleYoutubeInput = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

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

        <label htmlFor="image-upload">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            asChild
          >
            <div>
              <ImageIcon className="h-4 w-4" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelection(e, 'image')}
              />
            </div>
          </Button>
        </label>

        <label htmlFor="video-upload">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            asChild
          >
            <div>
              <Video className="h-4 w-4" />
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileSelection(e, 'video')}
              />
            </div>
          </Button>
        </label>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleYoutubeInput}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter link URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <label htmlFor="file-upload">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            asChild
          >
            <div>
              <FileText className="h-4 w-4" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileName = file.name;
                    const fileSize = (file.size / 1024).toFixed(2) + ' KB';
                    editor
                      .chain()
                      .focus()
                      .insertContent([{
                        type: 'paragraph',
                        content: [{
                          type: 'text',
                          text: '📎 '
                        }, {
                          type: 'text',
                          marks: [{
                            type: 'link',
                            attrs: { href: '#' }
                          }],
                          text: fileName
                        }, {
                          type: 'text',
                          text: ` (${fileSize})`
                        }]
                      }])
                      .run();
                  }
                }}
              />
            </div>
          </Button>
        </label>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      />
    </div>
  );
}