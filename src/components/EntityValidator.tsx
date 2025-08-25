import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface ValidationResult {
  entity: string;
  is_valid: boolean;
  is_empty: boolean;
  incorrect_statements: string[];
  missing_statements: string[];
  properties_with_too_many_statements: string[];
  required_properties_that_are_missing: string[];
  properties_without_enough_correct_statements: string[];
  statements_with_property_that_is_not_allowed: string[];
}

interface Props {
  entityIds: string[];
  entitySchemaId: string;
  autoValidate?: boolean;
}

export default function EntityValidator({
  entityIds,
  entitySchemaId,
  autoValidate,
}: Props) {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const validateEntities = useCallback(async () => {
  if (!entitySchemaId) {
    setError("EntitySchema ID is required");
    return;
  }
  if (entityIds.length === 0) {
    setError("No entities to validate");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const chunks: string[][] = [];
    for (let i = 0; i < entityIds.length; i += 100) {
      chunks.push(entityIds.slice(i, i + 100));
    }

    const allResults: ValidationResult[] = [];
    for (const chunk of chunks) {
      const ids = chunk.join(",");
      const url = `https://entityvalidator-backend.toolforge.org/api/v1/validate?eid=${entitySchemaId}&entity_ids=${ids}`;
      const response = await axios.get(url);
      allResults.push(...response.data.results);
    }

    setResults(allResults);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.message);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Validation failed");
    }
  } finally {
    setLoading(false);
  }
}, [entityIds, entitySchemaId]);

  useEffect(() => {
    if (autoValidate) {
      validateEntities();
    }
  }, [autoValidate, entityIds, entitySchemaId, validateEntities]);

  const renderProblems = (res: ValidationResult) => {
    const problemTypes: [keyof ValidationResult, string][] = [
      ["missing_statements", "Missing"],
      ["incorrect_statements", "Incorrect"],
      ["required_properties_that_are_missing", "Required missing"],
      ["statements_with_property_that_is_not_allowed", "Not allowed"],
      ["properties_with_too_many_statements", "Too many statements"],
      [
        "properties_without_enough_correct_statements",
        "Not enough correct statements",
      ],
    ];

    return (
      <ul>
        {problemTypes.map(([key, label]) => {
          const value = res[key];
          if (Array.isArray(value) && value.length > 0) {
            return value.map((item, idx) => {
              // Construct link if the item looks like a Wikidata property (e.g., P1427)
              const isProperty = /^P\d+$/.test(item);
              const url = isProperty
                ? `https://www.wikidata.org/wiki/${res.entity}#${item}`
                : undefined;

              return (
                <li key={`${key}-${idx}`}>
                  {label}:{" "}
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                </li>
              );
            });
          }
          return null;
        })}
      </ul>
    );
  };

  return (
    <div className="mt-4">
      <h4>Entity Validation</h4>
      <button
        className="btn btn-secondary mb-3"
        onClick={validateEntities}
        disabled={loading}
      >
        {loading ? "Validating..." : "Validate Entities"}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Valid</th>
              <th>Problems</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.entity}>
                <td>
                  <a
                    href={`https://www.wikidata.org/entity/${res.entity}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {res.entity}
                  </a>
                </td>
                <td>{res.is_valid ? "✅" : "❌"}</td>
                <td>{renderProblems(res)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
