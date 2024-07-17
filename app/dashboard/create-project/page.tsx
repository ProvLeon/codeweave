"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [folderName, setFolderName] = useState("");
  const [documentsCount, setDocumentsCount] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !folderName || documentsCount === undefined) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          ownerId: "user-id-placeholder", // Replace with actual user ID
          folderName,
          documentsCount,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create project");
      }
    } catch (error) {
      setError("Failed to create project");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Create New Project
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="title">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="description">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="folderName">
            Folder Name
          </label>
          <input
            type="text"
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="documentsCount">
            Number of Documents
          </label>
          <input
            type="number"
            id="documentsCount"
            value={documentsCount}
            onChange={(e) => setDocumentsCount(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="mr-2" />
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
