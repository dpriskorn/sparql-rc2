import { useState } from "react";
import type { Revisions } from "../components/ResultsTable";
import { useFetchRevisions } from "../components/useFetchRevisions";
import type { QueryFormValues } from "../components/QueryInputForm";
import WDQS from "../components/WDQS";
import QueryInputForm from "../components/QueryInputForm";
import ResultsTable from "../components/ResultsTable";
import EntityValidator from "../components/EntityValidator";
import NavbarComponent from "../layout/Navbar"; // import the navbar

export default function RevisionsTool() {
  const [results, setResults] = useState<Revisions[]>([]);
  const [entityCount, setEntityCount] = useState<number | null>(null);
  const [entitySchemaId, setEntitySchemaId] = useState<string>("");

  const { fetchRevisions, loading, error, setError } = useFetchRevisions();

  const handleQuerySubmit = async (values: QueryFormValues) => {
    setError(null);
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
      } else {
        throw new Error(
          "Please enter either a SPARQL query or a list of items"
        );
      }

      setEntityCount(entityList.length);
      setEntitySchemaId(values.entitySchemaId);

      const revisions = await fetchRevisions(
        entityList,
        values.startDate,
        values.endDate,
        values.noBots,
        values.unpatrolledOnly,
        values.excludeUsers
      );
      setResults(revisions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      <NavbarComponent /> {/* render navbar at the top */}
      <div className="container mt-4">
        <h3>
          Find recently changed entities and validate them against an
          EntitySchema
        </h3>

        <QueryInputForm onSubmit={handleQuerySubmit} loading={loading} />

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {(entityCount !== null || results.length > 0) && (
          <p className="mt-3">
            Found <strong>{entityCount ?? "?"}</strong> item
            {entityCount === 1 ? "" : "s"} and <strong>{results.length}</strong>{" "}
            revision{results.length === 1 ? "" : "s"}
          </p>
        )}

        <ResultsTable results={results} />

        {results.length > 0 && entitySchemaId && (
          <EntityValidator
            entityIds={results.map((r) => r.entity_id)}
            entitySchemaId={entitySchemaId}
          />
        )}
      </div>
    </>
  );
}
