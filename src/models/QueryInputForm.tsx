import React, { useState } from "react";

export interface QueryFormValues {
  sparqlQuery: string;
  items: string;
  startDate: string;
  endDate: string;
  noBots: boolean;
  unpatrolledOnly: boolean;
}

interface Props {
  onSubmit: (values: QueryFormValues) => void;
  loading: boolean;
}

export default function QueryInputForm({ onSubmit, loading }: Props) {
  const [sparqlQuery, setSparqlQuery] = useState("");
  const [items, setItems] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noBots, setNoBots] = useState(false);
  const [unpatrolledOnly, setUnpatrolledOnly] = useState(false); // new state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ sparqlQuery, items, startDate, endDate, noBots, unpatrolledOnly });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label className="form-label">SPARQL query (must return ?entity)</label>
        <textarea
          className="form-control"
          rows={4}
          value={sparqlQuery}
          onChange={(e) => setSparqlQuery(e.target.value)}
          placeholder="SELECT ?entity WHERE { ?entity wdt:P31 wd:Q5 } LIMIT 10"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Items (comma-separated)</label>
        <input
          type="text"
          className="form-control"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder="Q42, Q937"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Start date (YYYYMMDD)</label>
        <input
          type="text"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="20240101"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">End date (YYYYMMDD)</label>
        <input
          type="text"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="20240201"
        />
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="noBots"
          checked={noBots}
          onChange={(e) => setNoBots(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="noBots">
          No bot edits
        </label>
      </div>

      {/* New checkbox for unpatrolled only */}
      <div className="mb-3 form-check">
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

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Loading..." : "Get Recent Changes"}
      </button>
    </form>
  );
}
