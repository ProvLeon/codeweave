// components/CodeEditor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { io, Socket } from 'socket.io-client';

interface EditorProps {
  initialValue: string;
  documentId: string;
}

const CodeEditor = ({ initialValue, documentId }: EditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    const newSocket = io('/api/collaborate', {
      path: '/api/collaborate',
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-document', documentId);
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
  }, [documentId, editorView]);

  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: initialValue,
        extensions: [
          javascript(),
          keymap.of(defaultKeymap),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.changes) {
              if (socket) {
                socket.emit('document-change', {
                  documentId,
                  content: update.state.doc.toString(),
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
    }

    return () => {
      if (editorView) {
        editorView.destroy();
      }
    };
  }, [initialValue, socket]);

  return <div ref={editorRef} style={{ border: '1px solid black', height: '500px' }} />;
};

export default CodeEditor;
