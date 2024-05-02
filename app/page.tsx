"use client";

import { useNatsSubscription } from "@/hooks/useNats";

export default function Home() {
  // const iras = []
  useNatsSubscription("area3001.ira.>", async (data) => {
    console.log(data);
  });

  return (
    <main>
      <h1 className="bg-red-300">Home</h1>
    </main>
  );
}
