import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Revisions } from "../components/revisions/ResultsTable";
import { useFetchRevisions } from "../components/revisions/useFetchRevisions";
import type { QueryFormValues } from "../components/revisions/QueryInputForm";
import WDQS from "../models/WDQS";
import QueryInputForm from "../components/revisions/QueryInputForm";
import ResultsTable from "../components/revisions/ResultsTable";
import NavbarComponent from "../layout/Navbar";
import ResultsCopyLinks from "../components/revisions/ResultLinks";
import { decodeBase64, encodeBase64 } from "../utils/base64";
import NoticeLink from "../components/revisions/NoticeLink";

export default function RevisionsTool() {
  const [results, setResults] = useState<Revisions[]>([]);
  const [entityCount, setEntityCount] = useState<number | null>(null);

  const { fetchRevisions, loading, error, setError } = useFetchRevisions();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialValues: QueryFormValues = {
    sparqlQuery: searchParams.get("sparql")
      ? decodeBase64(searchParams.get("sparql") as string)
      : "",
    entitySchemaId: searchParams.get("schema") ?? "",
    startDate: searchParams.get("start") ?? "",
    endDate: searchParams.get("end") ?? "",
    noBots: searchParams.get("noBots") === "true",
    unpatrolledOnly: searchParams.get("unpatrolled") === "true",
    excludeUsers: searchParams.get("exclude") ?? "",
  };

  const fetchParam = searchParams.get("fetch") === "true";

  const [formValues, setFormValues] = useState<QueryFormValues>(initialValues);

  const handleQuerySubmit = async (values: QueryFormValues) => {
    setFormValues(values);

    const sparqlEncoded = encodeBase64(values.sparqlQuery);
    const newParams: Record<string, string> = {
      sparql: sparqlEncoded,
      schema: values.entitySchemaId,
      start: values.startDate,
      end: values.endDate,
      noBots: String(values.noBots),
      unpatrolled: String(values.unpatrolledOnly),
      exclude: values.excludeUsers,
    };
    if (fetchParam) newParams.fetch = "true";

    setSearchParams(newParams);

    setError(null);
    setResults([]);
    setEntityCount(null);

    try {
      if (!values.sparqlQuery.trim()) {
        throw new Error("Please enter a SPARQL query");
      }

      const wdqs = new WDQS();
      const entityList = await wdqs.getEntityIds(values.sparqlQuery);
      if (entityList.length === 0) {
        throw new Error("SPARQL query returned no entities");
      }

      setEntityCount(entityList.length);

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

  // Auto-fetch if fetch=true
  useEffect(() => {
    if (fetchParam && initialValues.sparqlQuery) {
      handleQuerySubmit(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchParam]);

  return (
    <>
      <NavbarComponent />
      <div className="container mt-4">
        <NoticeLink />
        <p>
          <b>Find recently changed entities</b>
        </p>

        <QueryInputForm
          onSubmit={handleQuerySubmit}
          loading={loading}
          initialValues={initialValues}
        />

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {(entityCount !== null || results.length > 0) && (
          <p className="mt-3">
            Found <strong>{entityCount ?? "?"}</strong> item
            {entityCount === 1 ? "" : "s"} and <strong>{results.length}</strong>{" "}
            revision{results.length === 1 ? "" : "s"}
          </p>
        )}

        <ResultsTable results={results} />

        {/* Show copy links only if we have fetched results */}
        {entityCount && entityCount > 0 && (
          <ResultsCopyLinks values={formValues} />
        )}
      </div>
    </>
  );
}
