'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react'
import { useEffect } from 'react'

export function RichTextEditor({ 
  value, 
  onChange,
  placeholder = "Describe what you need..."
}: { 
  value: string, 
  onChange: (val: string) => void,
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[140px] p-4 text-sm max-h-[300px] overflow-y-auto [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-2',
      },
    },
  })

  // Sync value when it changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 shadow-sm hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
