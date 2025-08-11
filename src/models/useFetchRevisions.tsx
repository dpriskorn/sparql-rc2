import { useState } from "react";
import type { Revisions } from "./ResultsTable";

interface BackendError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export function useFetchRevisions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRevisions(
    entityList: string[],
    startDate: string,
    endDate: string,
    noBots: boolean,
    unpatrolledOnly: boolean
  ): Promise<Revisions[]> {
    setLoading(true);
    setError(null);

    const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const entityChunks = chunkArray(entityList, 100);
    const allResults: Revisions[] = [];

    try {
      for (const chunk of entityChunks) {
        const params = new URLSearchParams();
        params.append("entities", chunk.join(","));
        if (startDate.trim()) params.append("start_date", startDate);
        if (endDate.trim()) params.append("end_date", endDate);
        params.append("no_bots", noBots ? "true" : "false");
        params.append("only_unpatrolled", unpatrolledOnly ? "true" : "false");

        const res = await fetch(
          `https://sparql-rc2-backend.toolforge.org/api/v2/revisions?${params.toString()}`
        );

        if (!res.ok) {
          let errorMessage = `HTTP error! Status: ${res.status}`;
          try {
            const errData = await res.json();
            if (errData.detail) {
              if (Array.isArray(errData.detail)) {
                errorMessage = errData.detail
                  .map((err: BackendError) => {
                    const loc = err.loc
                      ? err.loc.join(" > ")
                      : "unknown location";
                    return `${loc}: ${err.msg}`;
                  })
                  .join("; ");
              } else if (typeof errData.detail === "string") {
                errorMessage = errData.detail;
              }
            }
          } catch {
            // keep generic
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        allResults.push(...data);
      }
      setLoading(false);
      return allResults;
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  return { fetchRevisions, loading, error, setError };
}
