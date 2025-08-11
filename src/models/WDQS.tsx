// src/services/WikidataService.ts
// src/models/WDQS.tsx
export interface SparqlBindingValue {
  type: string;
  value: string;
}

export interface SparqlBinding {
  [variable: string]: SparqlBindingValue;
}

export interface SparqlResults {
  head: { vars: string[] };
  results: { bindings: SparqlBinding[] };
}

export default class WDQS {
  private endpoint = "https://query.wikidata.org/sparql";

  /**
   * Runs a SPARQL query against the Wikidata endpoint.
   * @param query The SPARQL query string
   * @returns Parsed JSON results
   */
  async runQuery(query: string): Promise<SparqlBinding[]> {
    const url = `${this.endpoint}?query=${encodeURIComponent(query)}`;
    const headers = {
      Accept: "application/sparql-results+json",
      "User-Agent": "YourAppName/1.0 (https://yourapp.example)",
    };

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`SPARQL query failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.results.bindings;
  }

  /**
   * Example helper: get entities from a SPARQL query that returns ?entity.
   * @param query A SPARQL query with a variable ?entity
   * @returns Array of QIDs (entity IDs)
   */
  async getEntityIds(query: string): Promise<string[]> {
    const bindings = await this.runQuery(query);
    if (bindings.length === 0) return [];

    for (const row of bindings) {
      if (!row.entity) {
        throw new Error("SPARQL results are missing ?entity variable in a binding");
      }
    }

    return bindings.map((row) =>
      row.entity.value.replace("http://www.wikidata.org/entity/", "")
    );
  }
}
