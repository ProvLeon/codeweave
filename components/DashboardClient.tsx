// components/DashboardClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Folder, FileText } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardClient({ session }: { session: any }) {
  const { data: projects, error } = useSWR(`/api/projects?userId=${session.user.id}`, fetcher, {
    refreshInterval: 60000, // Revalidate every 60 seconds
  });

  const router = useRouter();

  if (error) {
    return (
      <div className="rounded-l-lg p-4 h-full flex flex-col justify-center items-center dark:bg-slate-800 bg-slate-200">
        <h1 className="flex text-2xl font-bold mb-4 text-light-heading dark:text-light-background gap-2">
          No Data
        </h1>
        <p className="text-light-text dark:text-dark-text">No Connection</p>
      </div>
    );
  }

  if (!projects) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {session?.user.name}
      </h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-light-heading dark:text-dark-heading">
          Your Projects
        </h2>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => router.push("/dashboard/create-project")}
        >
          <Plus className="mr-2" />
          New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) && projects.map((project: { id: string; title: string; description: string; folderName: string; documentsCount: number }) => (
          <div
            key={project.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            <h3 className="text-xl font-bold text-light-heading dark:text-dark-heading mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.description}
            </p>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Folder className="mr-2" />
              {project.folderName}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
              <FileText className="mr-2" />
              {project.documentsCount} Documents
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => router.push("/dashboard/create-project")}
        >
          <Plus className="mr-2" />
          Create New Project
        </button>
      </div>
    </div>
  );
}
