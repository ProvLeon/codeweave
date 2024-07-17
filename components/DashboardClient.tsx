// components/DashboardClient.tsx
"use client";

import { useEffect, useState } from "react";


export default function DashboardClient({ session }: { session: any }) {




  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-light-heading dark:text-dark-heading mb-6">
        Welcome, {session?.user.name}
      </h1>

    </div>
  );
}
