import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Revisions } from "../components/ResultsTable";
import { useFetchRevisions } from "../components/useFetchRevisions";
import type { QueryFormValues } from "../components/QueryInputForm";
import WDQS from "../components/WDQS";
import QueryInputForm from "../components/QueryInputForm";
import ResultsTable from "../components/ResultsTable";
import EntityValidator from "../components/EntityValidator";
import NavbarComponent from "../layout/Navbar";
import ResultsCopyLinks from "../components/ResultLinks";
import { decodeBase64, encodeBase64 } from "../utils/base64";

export default function RevisionsTool() {
  const [results, setResults] = useState<Revisions[]>([]);
  const [entityCount, setEntityCount] = useState<number | null>(null);
  const [entitySchemaId, setEntitySchemaId] = useState<string>("");

  const { fetchRevisions, loading, error, setError } = useFetchRevisions();
  const [searchParams, setSearchParams] = useSearchParams();

  // Decode query params from URL
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
  const validateParam = searchParams.get("validate") === "true";

  // Track current form values for copy links
  const [formValues, setFormValues] = useState<QueryFormValues>(initialValues);

  const handleQuerySubmit = async (values: QueryFormValues) => {
    // Update form state
    setFormValues(values);

    // Encode SPARQL query
    const sparqlEncoded = encodeBase64(values.sparqlQuery);

    // Build URL params
    const newParams: Record<string, string> = {
      sparql: sparqlEncoded,
      schema: values.entitySchemaId,
      start: values.startDate,
      end: values.endDate,
      noBots: String(values.noBots),
      unpatrolled: String(values.unpatrolledOnly),
      exclude: values.excludeUsers,
      fetch: "true",
    };

    if (validateParam) {
      newParams.validate = "true";
    }

    setSearchParams(newParams);

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

  // Auto-run if fetch=true
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
        <p>
          <b>
            Find recently changed entities and validate them against an
            EntitySchema
          </b>
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

        {/* Copy URL buttons */}
        <ResultsCopyLinks values={formValues} />

        {/* Entity Validator */}
        {results.length > 0 && entitySchemaId && (
          <EntityValidator
            entityIds={results.map((r) => r.entity_id)}
            entitySchemaId={entitySchemaId}
            autoValidate={validateParam}
          />
        )}
      </div>
    </>
  );
}
