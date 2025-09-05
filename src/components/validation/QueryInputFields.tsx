import type { QueryFormValues } from "./QueryInputForm";


interface Props {
  values: QueryFormValues;
  errors: Record<string, string>;
  onChange: (field: keyof QueryFormValues, value: string | boolean) => void;
}

export default function QueryInputFields({ values, errors, onChange }: Props) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          SPARQL query (must return ?entity, ?item or ?lexeme)
        </label>
        <textarea
          className={`form-control ${errors.sparqlQuery ? "is-invalid" : ""}`}
          rows={4}
          value={values.sparqlQuery}
          onChange={(e) => onChange("sparqlQuery", e.target.value)}
          placeholder="SELECT DISTINCT ?entity WHERE { ?entity wdt:P31 wd:Q5 } LIMIT 10"
        />
        {errors.sparqlQuery && (
          <div className="invalid-feedback">{errors.sparqlQuery}</div>
        )}
      </div>

      <div className="mb-3 row">
        <div className="col-md">
          <label className="form-label">EntitySchema ID</label>
          <input
            type="text"
            className={`form-control ${
              values.entitySchemaId && !/^E\d+$/.test(values.entitySchemaId)
                ? "is-invalid"
                : ""
            }`}
            value={values.entitySchemaId}
            onChange={(e) => onChange("entitySchemaId", e.target.value)}
            placeholder="E123"
          />
          {values.entitySchemaId && !/^E\d+$/.test(values.entitySchemaId) && (
            <div className="invalid-feedback">
              EntitySchema ID must start with "E" followed by digits, e.g., E123
            </div>
          )}
        </div>

        <div className="col-md">
          <label className="form-label">Start date (YYYYMMDD)</label>
          <input
            type="text"
            className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
            value={values.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            placeholder="20240101"
          />
          {errors.startDate && (
            <div className="invalid-feedback">{errors.startDate}</div>
          )}
          <small className="form-text text-muted">
            Defaults to a week ago if left empty.
          </small>
        </div>

        <div className="col-md">
          <label className="form-label">End date (YYYYMMDD)</label>
          <input
            type="text"
            className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
            value={values.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            placeholder="20240201"
          />
          {errors.endDate && (
            <div className="invalid-feedback">{errors.endDate}</div>
          )}
          <small className="form-text text-muted">
            Defaults to now if left empty.
          </small>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Exclude users</label>
        <input
          type="text"
          className="form-control"
          value={values.excludeUsers}
          onChange={(e) => onChange("excludeUsers", e.target.value)}
          placeholder="User1, User2, User3"
        />
      </div>

      <div className="mb-3 row">
        <div className="col">
          <div className="col form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="noBots"
              checked={values.noBots}
              onChange={(e) => onChange("noBots", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="noBots">
              Exclude bot edits
            </label>
          </div>

          <div className="col form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="unpatrolledOnly"
              checked={values.unpatrolledOnly}
              onChange={(e) => onChange("unpatrolledOnly", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="unpatrolledOnly">
              Unpatrolled only
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
