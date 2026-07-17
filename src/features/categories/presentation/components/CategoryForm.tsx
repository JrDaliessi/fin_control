"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/Button";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import type {
  CategoryDto,
  CreateCategoryRequest
} from "../../application/dtos/category.dto";
import type { CategoryKind } from "../../domain/entities/category.entity";
import {
  type CategoryFormField,
  type CategoryFormValues,
  useCategoryForm
} from "../hooks/useCategoryForm";

type CategoryFormProps = {
  onCreateCategory: (input: CreateCategoryRequest) => Promise<CategoryDto>;
};

const fieldClassName =
  "min-h-11 rounded border border-border bg-surface px-3 py-2 text-base text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-focus-ring/30 disabled:bg-surface-muted sm:text-sm";
const fieldErrorClassName =
  "border-danger focus-visible:border-danger focus-visible:ring-danger/30";
const messageId = "category-form-message";

const categoryKindOptions: Array<{ label: string; value: CategoryKind }> = [
  { label: "Despesa", value: "expense" },
  { label: "Receita", value: "income" }
];

export function CategoryForm({ onCreateCategory }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: "",
    kind: "expense"
  });
  const { fieldError, isSubmitting, message, status, submit } = useCategoryForm({
    onCreateCategory
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await submit(values);

    if (result.ok) {
      setValues((currentValues) => ({ ...currentValues, name: "" }));
    }
  }

  function updateValue<Key extends keyof CategoryFormValues>(
    key: Key,
    value: CategoryFormValues[Key]
  ) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function getFieldClassName(field: CategoryFormField) {
    return fieldError === field
      ? `${fieldClassName} ${fieldErrorClassName}`
      : fieldClassName;
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Cadastro de categoria"
      className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="category-name">
          Nome da categoria
        </label>
        <input
          aria-describedby={fieldError === "name" ? messageId : undefined}
          aria-invalid={fieldError === "name"}
          className={getFieldClassName("name")}
          id="category-name"
          maxLength={80}
          name="name"
          onChange={(event) => updateValue("name", event.target.value)}
          required
          type="text"
          value={values.name}
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="category-kind">
          Tipo da categoria
        </label>
        <select
          className={fieldClassName}
          id="category-kind"
          name="kind"
          onChange={(event) =>
            updateValue("kind", event.target.value as CategoryKind)
          }
          value={values.kind}
        >
          {categoryKindOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Salvando..." : "Cadastrar categoria"}
      </Button>

      {message ? (
        <FeedbackMessage
          id={messageId}
          variant={status === "error" ? "error" : "status"}
        >
          {message}
        </FeedbackMessage>
      ) : null}
    </form>
  );
}
