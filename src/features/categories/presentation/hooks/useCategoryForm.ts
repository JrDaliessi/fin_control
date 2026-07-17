"use client";

import { useState } from "react";
import type {
  CategoryDto,
  CreateCategoryRequest
} from "../../application/dtos/category.dto";
import { normalizeCategoryName } from "../../domain/entities/category.entity";

export type CategoryFormValues = CreateCategoryRequest;
export type CategoryFormField = keyof CategoryFormValues;
export type CategoryFormSubmitResult = {
  fieldError?: CategoryFormField;
  ok: boolean;
};

type UseCategoryFormInput = {
  onCreateCategory: (input: CreateCategoryRequest) => Promise<CategoryDto>;
};

type CategoryFormState = {
  fieldError?: CategoryFormField;
  message?: string;
  status: "idle" | "submitting" | "success" | "error";
};

const initialState: CategoryFormState = { status: "idle" };

export function useCategoryForm({ onCreateCategory }: UseCategoryFormInput) {
  const [state, setState] = useState<CategoryFormState>(initialState);

  function clearFeedback() {
    setState((currentState) =>
      currentState.status === "submitting" ? currentState : initialState
    );
  }

  async function submit(
    values: CategoryFormValues
  ): Promise<CategoryFormSubmitResult> {
    const name = normalizeCategoryName(values.name);

    if (!name) {
      setState({
        fieldError: "name",
        message: "Informe o nome da categoria.",
        status: "error"
      });
      return { fieldError: "name", ok: false };
    }

    setState({ status: "submitting" });

    try {
      await onCreateCategory({ name, kind: values.kind });
      setState({ message: "Categoria cadastrada.", status: "success" });
      return { ok: true };
    } catch {
      setState({
        message: "Não foi possível cadastrar a categoria.",
        status: "error"
      });
      return { ok: false };
    }
  }

  return {
    clearFeedback,
    fieldError: state.fieldError,
    isSubmitting: state.status === "submitting",
    message: state.message,
    status: state.status,
    submit
  };
}
