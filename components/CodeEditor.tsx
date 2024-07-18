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
import { languages } from '@codemirror/language-data';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
//import { }
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Terminal from './Terminal';
import { EyeIcon, EyeOffIcon, Tv2Icon, ZapIcon, CloudIcon, CloudOff } from 'lucide-react';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
//import executeCode from '@/lib/Execute';

interface EditorProps {
  initialValue: string;
  document: { id: string, content: string, title: string };
  collaborative?: boolean;
  className?: string;
  showTerminal?: boolean;
  setShowTerminal?: Dispatch<SetStateAction<boolean>>;
  language: 'javascript' | 'python' | 'java'  | 'c++' | 'c' | 'rust';
  setLanguage: Dispatch<SetStateAction<'javascript' | 'python' | 'java' | 'c++' | 'c' | 'rust'>>;
}

const languageExtensions = {
  javascript,
  python,
  java,
  //html,
  //json,
  //sql,
  //markdown,
  c: cpp,
  "c++": cpp,
  rust,
};

const CodeEditor = ({ initialValue, document, collaborative = false, className, showTerminal = false, setShowTerminal, language, setLanguage }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [executionResult, setExecutionResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState(document.content);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isSaved, setIsSaved] = useState(false);

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
          closeBrackets(),
          syntaxHighlighting(defaultHighlightStyle),
          keymap.of([...defaultKeymap, indentWithTab, ...closeBracketsKeymap]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              setDocumentContent(newContent);
              setLastUpdate(Date.now());
              setIsSaved(false);
              if (collaborative && socket) {
                socket.emit('document-change', {
                  id: document.id,
                  content: newContent,
                });
              }
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
  }, [document.content, collaborative, socket, language]);

  //useEffect(() => {
  //  const interval = setInterval(() => {
  //    if (Date.now() - lastUpdate >= 2000) {
  //      updateDocument({content: documentContent, document: document});
  //    }
  //  }, 2000);

  //  return () => clearInterval(interval);
  //}, [documentContent, lastUpdate]);

  const runCode = async (setShowTerminal: Dispatch<SetStateAction<boolean>>) => {
    setShowTerminal(true)
    setLoading(true)
    if (editorView) {
      const result = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: editorView.state.doc.toString(),
          language,
        }),
      })
      if (result.ok) {
        const resultJson = await result.json();
      setExecutionResult(resultJson.output);
      }
    }
    setLoading(false)
  };

  const updateDocument = async ({ content, document }: { content: string, document: { id: string } }) => {
    try {
      if (document.id === "1")
        return
      //setLoading(true)
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update document: ${errorText}`);
      }
      setIsSaved(true);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };


  return (
    <div className={`w-full h-full ${className}`}>
      <CardTitle className="text-light-heading dark:text-dark-heading px-3 py-2 pr-6 flex items-center justify-between">
        <div className="flex justify-center gap-2">
          <p className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">{document?.title}</p>
          {isSaved ? <div className="items-center">
            <CloudIcon className="ml-2 text-green-500" />
            <p className="text-xs text-green-500 -mt-2">Saved</p>
            </div>
            : <div className="items-center">
            <CloudOff className="ml-2 text-red-500" />
            <p className="text-xs -mt-2 text-red-500">Unsaved</p>
            </div>
            }
        </div>
        <div className="flex items-center gap-5 flex-row">
          <select
            className="mt-2 p-2 text-dark-heading rounded-lg text-xs outline-none bg-active"
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value as
                  | 'javascript'
                  | 'python'
                  | 'java'
                  | 'c++'
                  | 'c'
                  | 'rust'
              )
            }
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            {/*<option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="sql">SQL</option>
            <option value="markdown">Markdown</option>*/}
            <option value="c">C</option>
            <option value="c++">C++</option>
            <option value="rust">Rust</option>
          </select>
          <Button
            className="mt-2 p-2 text-white rounded-lg"
            onClick={
              setShowTerminal ? () => setShowTerminal((prev) => !prev) : () => {}
            }
            variant="default"
          >
            {showTerminal ? (
              <div className="relative">
                <EyeIcon />
                <div className="absolute -right-1 top-3">
                  <Tv2Icon
                    style={{
                      width: '10px',
                      color: 'aliceblue',
                      fontStyle: 'normal',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <EyeOffIcon />
                <div className="absolute -right-1 top-3">
                  <Tv2Icon
                    style={{ width: '10px', color: 'tomato', fontStyle: 'normal' }}
                  />
                </div>
              </div>
            )}
          </Button>
          <Button className="mt-2 p-2 text-white rounded-lg" onClick={() => setShowTerminal && runCode(setShowTerminal)} variant="default">
            <ZapIcon size={20} />
          </Button>
        </div>
      </CardTitle>
      <CardContent
        className={`h-[calc(100vh-${
          showTerminal ? '200px' : '100px'
        })] overflow-hidden`}
      >
        <div
          ref={editorRef}
          className={` border border-gray-300 dark:border-gray-700  rounded-t-lg overflow-y-auto ${
            showTerminal ? 'h-[57vh]' : 'h-[81vh] rounded-b-lg'
          } dark:bg-neutral-900 dark:bg-opacity-65 bg-gray-950 bg-opacity-85`}
          onBlur={() => updateDocument({content: documentContent, document})}
        />
        {showTerminal && <Terminal executionResult={executionResult} isLoading={loading}/>}
      </CardContent>
    </div>
  );
};

export default CodeEditor;
