// components/DashboardClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Folder, FileText, Edit3, FoldersIcon } from "lucide-react";
//import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import withAuth from "@/components/withAuth";
import { useUser } from "@/contexts/UserContext";

type Document = {
  id: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: string;
};

type Folder = {
  id: string;
  name: string;
  documents: Document[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DashboardClient = () => {
  const { user } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: projects, error } = useSWR(
    user && !user?.signedOut ? `/api/projects?userId=${user?.id}` : null, // Only fetch if user is defined
    fetcher,
    {
      refreshInterval: 60000, // Revalidate every 60 seconds
    }
  );

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          ownerId: user.id,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        router.refresh();
      } else {
        setErrorMessage("Failed to create project");
        console.error("Failed to create project");
      }
    } catch (error) {
      setErrorMessage(`Failed to create project: ${error}`);
    }
  };

  const handleEditProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        setEditProjectId(null);
        setShowModal(false);
        router.refresh();
      } else {
        setErrorMessage("Failed to update project");
        console.error("Failed to update project");
      }
    } catch (error) {
      setErrorMessage(`Failed to update project: ${error}`);
    }
  };

  // ... existing code ...
  if (error || (projects === undefined)) {
    return (
      <div className="rounded-l-lg p-4 h-full flex flex-col justify-center items-center dark:bg-slate-800 bg-slate-200">
        {error ?
        <>
          <h1 className="flex text-2xl font-bold mb-4 text-light-heading dark:text-light-background gap-2">
            No Data
          </h1>
          <p className="text-light-text dark:text-dark-text">No Connection</p>
        </>
        :
        <>
          <div className="flex items-center gap-2 mb-5">
            <h1 className="flex text-2xl font-bold text-light-heading dark:text-light-background gap-2">
              No Projects
            </h1>
            <Image src="/assets/icons8-about-420.svg" alt="Team Collaboration" className=" rounded-lg " width={30} height={30} />
          </div>
          <Button
          className="flex items-center px-4 py-2 text-white rounded-lg"
          onClick={() => setShowModal(true)}
            >
          <Plus className="mr-2" />
          New Project
          </Button>
        </>
        }
        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">
              {editProjectId ? "Edit Project" : "Create New Project"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={editProjectId ? () => handleEditProject(editProjectId) : handleCreateProject}
              >
                {editProjectId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  }

  //if (!projects) {
  //  return (<div className="h-screen my-[200px]">
  //  <LoadingSpinner />
  //  </div>
  //  )}
  //console.log(projects);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {user.name}
      </h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-light-heading dark:text-dark-heading">
          Your Projects
        </h2>
        <Button
          className="flex items-center px-4 py-2 text-white rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="mr-2" />
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) && projects.map((project: { id: string; title: string; description: string; folders: Folder[]; }) => (
          <Card
            key={project.id}
            className="p-4 relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-light-heading dark:text-dark-heading">
                  {project.title}
                </h3>
                <Edit3
                  className="cursor-pointer text-gray-500 dark:text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditProjectId(project.id);
                    setTitle(project.title);
                    setDescription(project.description);
                    setShowModal(true);
                  }}
                />
              </div>
            </CardHeader>
            <CardDescription className="ml-6 text-gray-600 dark:text-gray-400 mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>
            </CardDescription>
            <CardFooter className="flex justify-between items-center mt-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Folder className="mr-1" />
                {project.folders.length}<p>Folders</p>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 ">
                <FileText className="mr-1" />
                {project.folders.reduce((acc, folder) => acc + (folder.documents?.length || 0), 0)}<p>Documents</p>
              </div>
              <div className="absolute right-4 top-10 cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/projects/${project.id}/playground`);
                }}
              >
                <FoldersIcon className="text-gray-500 dark:text-gray-400" />
                <p className="text-gray-500 dark:text-dark-text duration-300 text-xs -mt-1">open</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-light-heading dark:text-dark-heading">
              {editProjectId ? "Edit Project" : "Create New Project"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={editProjectId ? () => handleEditProject(editProjectId) : handleCreateProject}
              >
                {editProjectId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(DashboardClient)
