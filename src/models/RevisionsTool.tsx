import { useState } from "react";
import QueryInputForm, { type QueryFormValues } from "./QueryInputForm";
import ResultsTable, { type Revisions } from "./ResultsTable";
import WDQS from "./WDQS";

export default function RevisionsTool() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Revisions[]>([]);
  const [error, setError] = useState("");
  const [entityCount, setEntityCount] = useState<number | null>(null); // NEW

  const handleQuerySubmit = async (values: QueryFormValues) => {
    setLoading(true);
    setError("");
    setResults([]);
    setEntityCount(null);

    try {
      let entityList: string[] = [];

      if (values.sparqlQuery.trim()) {
        const wdqs = new WDQS();
        entityList = await wdqs.getEntityIds(values.sparqlQuery);
        if (entityList.length === 0) {
          throw new Error("SPARQL query returned no entities");
        }
      } else if (values.items.trim()) {
        entityList = values.items
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      } else {
        throw new Error(
          "Please enter either a SPARQL query or a list of items"
        );
      }

      setEntityCount(entityList.length); // track entities count

      const params = new URLSearchParams();
      params.append("entities", entityList.join(","));
      if (values.startDate.trim())
        params.append("start_date", values.startDate);
      if (values.endDate.trim()) params.append("end_date", values.endDate);
      params.append("no_bots", values.noBots ? "true" : "false");
      params.append("only_unpatrolled", values.unpatrolledOnly ? "true" : "false");

      const res = await fetch(
        `https://sparql-rc2-backend.toolforge.org/api/v2/revisions?${params.toString()}`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>
        Get diffs for all items matching a SPARQL query, or a list, for a date
        range
      </h2>

      <QueryInputForm onSubmit={handleQuerySubmit} loading={loading} />

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {(entityCount !== null || results.length > 0) && (
        <p className="mt-3">
          Found <strong>{entityCount ?? "?"}</strong> item
          {entityCount === 1 ? "" : "s"} and <strong>{results.length}</strong>{" "}
          revision
          {results.length === 1 ? "" : "s"}
        </p>
      )}

      <ResultsTable results={results} />
    </div>
  );
}
