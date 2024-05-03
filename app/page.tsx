"use client";

import { useIras } from "@/hooks/useNats";

export default function Home() {
  const { iras, error } = useIras("area3001.ira.>");

  return (
    <main>
      <h1 className="bg-red-300">Home</h1>

      {error && (
        <div>
          <p>Something went wrong...</p>
          <pre>{error.message}</pre>
        </div>
      )}

      <ul>
        {Array.from(iras.entries()).map(([id, ira]) => {
          return (
            <li key={id}>
              <pre>
                {JSON.stringify(
                  { id, ira },
                  // Just for stringifying purposes, convert Map to object.
                  (k, v) => {
                    if (v instanceof Map) {
                      return Object.fromEntries(v.entries());
                    }
                    return v;
                  },
                  2,
                )}
              </pre>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
