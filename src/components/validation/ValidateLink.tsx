import { useMemo, useState } from "react";
import type { QueryFormValues } from "../revisions/QueryInputForm";

function utf8EncodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function ResultsCopyLinks({ values }: { values: QueryFormValues }) {
  const [copied, setCopied] = useState<string | null>(null);

  // Build base64 encoded query param (UTF-8 safe)
  const encodedQuery = useMemo(
    () => utf8EncodeBase64(values.sparqlQuery || ""),
    [values.sparqlQuery]
  );

  // Common params
  const baseParams = new URLSearchParams({
    sparql: encodedQuery,
    schema: values.entitySchemaId || "",
    start: values.startDate || "",
    end: values.endDate || "",
    noBots: String(values.noBots),
    unpatrolled: String(values.unpatrolledOnly),
    exclude: values.excludeUsers || "",
  });

  const baseUrl = window.location.origin + window.location.pathname;

  // Different variants
  const urlFetchValidate = `${baseUrl}?${baseParams.toString()}&fetch=true&validate=true`;

  const handleCopy = async (label: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-4">
      <button
        className="btn btn-outline-danger"
        onClick={() =>
          handleCopy("Query + Settings + Fetch + Validate", urlFetchValidate)
        }
      >
        {copied === "Query + Settings + Fetch + Validate"
          ? "✅ Copied!"
          : "Copy Query + Settings + Fetch + Validate"}
      </button>
    </div>
  );
}

export default ResultsCopyLinks;
