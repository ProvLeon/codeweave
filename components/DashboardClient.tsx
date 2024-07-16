// components/DashboardClient.tsx
"use client";

import { useEffect, useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import FolderTree from "@/components/FolderTree";
import { Card } from "./ui/card";

export default function DashboardClient({ session }: { session: any }) {
  const [selectedDocument, setSelectedDocument] = useState<{ id: string, content: string, title: string } | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'html' | 'json' | 'sql' | 'markdown' | 'cpp' | 'rust'>('javascript');

  const languages = {
    "javascript": {
      id: "1",
      title: "Addition",
      content:
`function add(a, b) {
  return a + b;
}`
  },
  "python": {
    id: "2",
    title: "Addition",
    content:
`def add(a, b):
  return a + b
`
  },
  "java": {
    id: "3",
    title: "Addition",
    content:
`public class Add {
  public static int add(int a, int b) {
    return a + b;
  }
}
`
  },
  "html": {
    id: "4",
    title: "Addition",
    content:
`<html>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>
`
  },
  "cpp": {
    id: "5",
    title: "Addition",
    content:
`#include <iostream>
using namespace std;

int add(int a, int b) {
  return a + b;
}`
  },
  "rust": {
    id: "6",
    title: "Addition",
    content:
`fn add(a: int, b: int) -> int {
  return a + b
}`
  },
  "json": {
    id: "7",
    title: "Addition",
    content:
`{
  "key": "value"
}`
  },
  "markdown": {
    id: "8",
    title: "Addition",
    content:
`# My First Heading
## My First Subheading
`
  },
  "sql": {
    id: "9",
    title: "Addition",
    content:
`SELECT * FROM table
`
  },

};


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {session?.user.name}
      </h1>
      <div className="grid grid-rows-[1fr_auto] bg-light-background h-[80vh] dark:bg-dark-background rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700">
        <div className="grid grid-cols-5 flex-1 overflow-hidden">
          <div className="col-span-1 row-span-1 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
            <FolderTree userId={session.user.id} onDocumentSelect={setSelectedDocument} />
          </div>
          <div className="col-span-4 overflow-hidden">
            {selectedDocument ? (
              <CodeEditor
                document={selectedDocument}
                initialValue={selectedDocument.content}
                showTerminal={showTerminal}
                setShowTerminal={setShowTerminal}
                language={language}
                setLanguage={setLanguage}
                collaborative={true}
              />
            ) : (
              //{
                //languages.[language] &&
                (<CodeEditor
                document={languages[language]}
                initialValue={languages.javascript.content}
                showTerminal={showTerminal}
                setShowTerminal={setShowTerminal}
                language={language}
                setLanguage={setLanguage}
                />)
              //}
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
