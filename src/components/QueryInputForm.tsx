import React, { useState } from "react";

export interface QueryFormValues {
  sparqlQuery: string;
  entitySchemaId: string;
  startDate: string;
  endDate: string;
  noBots: boolean;
  unpatrolledOnly: boolean;
  excludeUsers: string;
}

interface Props {
  onSubmit: (values: QueryFormValues) => void;
  loading: boolean;
  initialValues: QueryFormValues;
}

export default function QueryInputForm({
  onSubmit,
  loading,
  initialValues,
}: Props) {
  const [sparqlQuery, setSparqlQuery] = useState(initialValues.sparqlQuery);
  const [entitySchemaId, setEntitySchemaId] = useState(
    initialValues.entitySchemaId
  );
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [noBots, setNoBots] = useState(initialValues.noBots);
  const [unpatrolledOnly, setUnpatrolledOnly] = useState(
    initialValues.unpatrolledOnly
  );
  const [excludeUsers, setExcludeUsers] = useState(initialValues.excludeUsers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      sparqlQuery,
      entitySchemaId,
      startDate,
      endDate,
      excludeUsers,
      noBots,
      unpatrolledOnly,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label className="form-label">
          SPARQL query (must return ?entity, ?item or ?lexeme)
        </label>
        <textarea
          className="form-control"
          rows={4}
          value={sparqlQuery}
          onChange={(e) => setSparqlQuery(e.target.value)}
          placeholder="SELECT DISTINCT ?entity WHERE { ?entity wdt:P31 wd:Q5 } LIMIT 10"
        />
      </div>

      <div className="mb-3 row">
        <div className="col-md">
          <label className="form-label">EntitySchema ID</label>
          <input
            type="text"
            className="form-control"
            value={entitySchemaId}
            onChange={(e) => setEntitySchemaId(e.target.value)}
            placeholder="E123"
          />
        </div>
        <div className="col-md">
          <label className="form-label">Start date (YYYYMMDD)</label>
          <input
            type="text"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="20240101"
          />
          <small className="form-text text-muted">
            Defaults to a week ago if left empty.
          </small>
        </div>

        <div className="col-md">
          <label className="form-label">End date (YYYYMMDD)</label>
          <input
            type="text"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="20240201"
          />
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
          value={excludeUsers}
          onChange={(e) => setExcludeUsers(e.target.value)}
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
              checked={noBots}
              onChange={(e) => setNoBots(e.target.checked)}
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
              checked={unpatrolledOnly}
              onChange={(e) => setUnpatrolledOnly(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="unpatrolledOnly">
              Unpatrolled only
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Loading..." : "Get Recent Changes"}
      </button>
    </form>
  );
}
