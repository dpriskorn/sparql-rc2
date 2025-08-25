import React, { useState } from "react";
import QueryInputFields from "./QueryInputFields";

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
  const [values, setValues] = useState<QueryFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof QueryFormValues,
    value: string | boolean
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.sparqlQuery.trim()) {
      newErrors.sparqlQuery = "SPARQL query is required.";
    } else if (!/\?(entity|item|lexeme)/i.test(values.sparqlQuery)) {
      newErrors.sparqlQuery = "Query must return ?entity, ?item or ?lexeme.";
    }

    if (!values.entitySchemaId.trim()) {
      newErrors.entitySchemaId = "EntitySchema ID is required.";
    }

    const dateRegex = /^\d{8}$/;
    if (values.startDate && !dateRegex.test(values.startDate)) {
      newErrors.startDate = "Start date must be in YYYYMMDD format.";
    }
    if (values.endDate && !dateRegex.test(values.endDate)) {
      newErrors.endDate = "End date must be in YYYYMMDD format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <QueryInputFields
        values={values}
        errors={errors}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Loading..." : "Fetch recent changes"}
      </button>
    </form>
  );
}
