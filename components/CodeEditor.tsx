// components/CodeEditor.tsx
'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { html } from '@codemirror/lang-html';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';
import { indentWithTab } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
//import { }
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Terminal from './Terminal';
import { EyeIcon, EyeOffIcon, Tv2Icon, ZapIcon } from 'lucide-react';

interface EditorProps {
  initialValue: string;
  document: { id: string, content: string, title: string };
  collaborative?: boolean;
  className?: string;
  showTerminal?: boolean;
  setShowTerminal?: Dispatch<SetStateAction<boolean>>;
  language: 'javascript' | 'python' | 'java' | 'html' | 'json' | 'sql' | 'markdown' | 'cpp' | 'rust';
  setLanguage: Dispatch<SetStateAction<'javascript' | 'python' | 'java' | 'html' | 'json' | 'sql' | 'markdown' | 'cpp' | 'rust'>>;
}

const languageExtensions = {
  javascript,
  python,
  java,
  html,
  json,
  sql,
  markdown,
  cpp,
  rust,
};

const CodeEditor = ({ initialValue, document, collaborative = false, className, showTerminal = false, setShowTerminal, language, setLanguage }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (collaborative) {
      const newSocket = io('/api/collaborate', {
        path: '/api/collaborate',
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join-document', document.id);
      });

      newSocket.on('document-change', ({ content }) => {
        if (editorView && editorView.state.doc.toString() !== content) {
          editorView.dispatch({
            changes: { from: 0, to: editorView.state.doc.length, insert: content },
          });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [collaborative, document, editorView]);

  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: document.content,
        extensions: [
          lineNumbers(),
          languageExtensions[language](),
          keymap.of(defaultKeymap),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (collaborative && update.changes && socket) {
              socket.emit('document-change', {
                id: document.id,
                content: update.state.doc.toString(),
              });
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      setEditorView(view);

      return () => {
        view.destroy();
      };
    }
  }, [document, collaborative, socket, language]);

  return (
    <div className={`w-full h-full ${className}`}>
      <CardTitle className="text-light-heading dark:text-dark-heading px-3 py-2 pr-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">{document?.title}</h1>
        <div className="flex items-center gap-5 flex-row">
          <select
            className="mt-2 p-2 text-dark-heading rounded-lg text-xs outline-none bg-active"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'javascript' | 'python' | 'java' | 'html' | 'json' | 'sql' | 'markdown' | 'cpp' | 'rust')}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="sql">SQL</option>
            <option value="markdown">Markdown</option>
            <option value="cpp">C++</option>
            <option value="rust">Rust</option>
          </select>
          <Button
            className="mt-2 p-2 text-white rounded-lg"
            onClick={setShowTerminal ? () => setShowTerminal(prev => !prev) : () => {}}
            variant="default"
            >
            {showTerminal ?
            <div className='relative'>
              <EyeIcon />
              <div className='absolute -right-1 top-3'>
                <Tv2Icon style={{width: "10px", color: 'aliceblue', fontStyle: 'normal'}}/>
              </div>
            </div>
            :
            <div className='relative'>
              <EyeOffIcon />
              <div className='absolute -right-1 top-3'>
              <Tv2Icon style={{width: "10px", color: 'tomato', fontStyle: 'normal'}}/>
              </div>
            </div>
            }

          </Button>
          <Button className="mt-2 p-2 text-white rounded-lg">
            <ZapIcon size={20} />
          </Button>
            </div>
      </CardTitle>
      <CardContent className={`h-[calc(100vh-${showTerminal ? '200px' : '100px'})] overflow-hidden`}>
        <div ref={editorRef} className={`border border-gray-300 dark:border-gray-700 rounded-lg overflow-y-auto ${showTerminal ? 'h-[70%]' : 'h-[75vh]'} bg-neutral-800 bg-opacity-70`} />
        {showTerminal && <Terminal />}
      </CardContent>
    </div>
  );
};

export default CodeEditor;
