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
   * Get entity/lexeme/item IDs from a SPARQL query.
   * Supports ?entity, ?item, and ?lexeme variables.
   * @param query A SPARQL query with one of these variables
   * @returns Array of IDs (QIDs, LIDs, etc.)
   */
  async getEntityIds(query: string): Promise<string[]> {
    const bindings = await this.runQuery(query);
    if (bindings.length === 0) return [];

    // allowed variable names
    const candidates = ["entity", "item", "lexeme"];
    // figure out which one is present in results
    const varName = candidates.find((name) =>
      Object.prototype.hasOwnProperty.call(bindings[0], name)
    );

    if (!varName) {
      throw new Error(
        "SPARQL results are missing ?entity, ?item, or ?lexeme variable in bindings"
      );
    }

    return bindings.map((row) =>
      row[varName].value.replace("http://www.wikidata.org/entity/", "")
    );
  }
}
