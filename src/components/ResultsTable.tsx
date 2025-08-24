
type UserCount = {
  user_id: number;
  username: string;
  count: number;
};

type Revision = {
  rev_id: number;
  rev_page: number;
  rev_user: number;
  rev_user_text: string; // username
  rev_timestamp: string;
  rc_patrolled: number;
};

export type Revisions = {
  page_id: number;
  entity_id: string;
  earliest: Revision;
  latest: Revision;
  note: string;
  users: UserCount[];
};

interface Props {
  results: Revisions[];
}

export default function ResultsTable({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="mt-4">
      <h4>Results</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Entity ID</th> {/* Changed header */}
            <th>Earliest rev</th>
            <th>Latest rev</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {results.map((rev) => (
            <tr key={rev.page_id}>
              <td>
                <a
                  href={`https://www.wikidata.org/entity/${rev.entity_id}`}
                  target="_blank"
                  // rel="noopener noreferrer"
                >
                  {rev.entity_id}
                </a>
              </td>
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
  );
}
