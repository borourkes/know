import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';

// Common editor configuration
export const editorConfig = {
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
};

// Helper to ensure content is properly parsed
export const parseContent = (content: string) => {
  if (!content) return '';
  try {
    return JSON.parse(content);
  } catch {
    // If it's not JSON, return as is (for backward compatibility)
    return content;
  }
};