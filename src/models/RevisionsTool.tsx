import React, { useState } from "react";

type UserCount = {
  user_id: number;
  username: string;
  count: number;
};

type Revision = {
  rev_id: number;
  rev_page: number;
  rev_user: number;
  rev_user_text: string;
  rev_timestamp: string;
};

type Revisions = {
  page_id: number;
  earliest: Revision;
  latest: Revision;
  note: string;
  users: UserCount[];
};

export default function RevisionsTool() {
  const [items, setItems] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noBots, setNoBots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Revisions[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const params = new URLSearchParams();
      items.split(",").map((item) => params.append("items", item.trim()));
      params.append("start_date", startDate);
      params.append("end_date", endDate);
      params.append("no_bots", noBots ? "true" : "false");

      const res = await fetch(
        `http://127.0.0.1:8000/revisions?${params.toString()}`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Get diffs for all items matching a SPARQL query, for a date range</h2>

      <form onSubmit={handleSubmit} className="mt-3">
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

        <button type="submit" className="btn btn-primary">
          Get Recent Changes
        </button>
      </form>

      {loading && <p className="mt-3">Loading...</p>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {results.length > 0 && (
        <div className="mt-4">
          <h4>Results</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Page ID</th>
                <th>Earliest rev</th>
                <th>Latest rev</th>
                <th>Users</th>
              </tr>
            </thead>
            <tbody>
              {results.map((rev) => (
                <tr key={rev.page_id}>
                  <td>{rev.page_id}</td>
                  <td>{rev.earliest.rev_timestamp}</td>
                  <td>{rev.latest.rev_timestamp}</td>
                  <td>
                    {rev.users.map((u) => (
                      <span key={u.user_id} className="me-2">
                        {u.username} ({u.count})
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
