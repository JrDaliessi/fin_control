import { describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CreateAccountRequest,
  FinancialAccountDto
} from "../application/dtos/financial-account.dto";
import { AccountForm } from "../presentation/components/AccountForm";

const persistedAccount: FinancialAccountDto = {
  id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  name: "Conta principal",
  type: "checking",
  initialBalanceInCents: 125050,
  currency: "BRL",
  createdAt: "2026-07-14T10:00:00.000Z",
  updatedAt: "2026-07-14T10:00:00.000Z"
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, reject, resolve };
}

async function fillValidForm() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Nome da conta"), "Conta principal");
  await user.selectOptions(screen.getByLabelText("Tipo de conta"), "checking");
  await user.type(screen.getByLabelText("Saldo inicial"), "1.250,50");

  return user;
}

describe("AccountForm", () => {
  it("submits normalized account data and exposes the submitting and success states", async () => {
    const deferred = createDeferred<FinancialAccountDto>();
    const onCreateAccount = jest.fn<
      (input: CreateAccountRequest) => Promise<FinancialAccountDto>
    >(() => deferred.promise);
    render(<AccountForm onCreateAccount={onCreateAccount} />);
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
    expect(onCreateAccount).toHaveBeenCalledWith({
      name: "Conta principal",
      type: "checking",
      initialBalanceInCents: 125050,
      currency: "BRL"
    });

    await act(async () => deferred.resolve(persistedAccount));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Conta cadastrada."
    );
  });

  it("shows an accessible error and does not submit an invalid balance", async () => {
    const onCreateAccount = jest.fn<() => Promise<FinancialAccountDto>>();
    render(<AccountForm onCreateAccount={onCreateAccount} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nome da conta"), "Conta principal");
    await user.type(screen.getByLabelText("Saldo inicial"), "10,999");
    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Informe um saldo inicial válido."
    );
    expect(screen.getByLabelText("Saldo inicial")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(onCreateAccount).not.toHaveBeenCalled();
  });

  it("announces errors returned by the account flow", async () => {
    const onCreateAccount = jest.fn(async () => {
      throw new Error("repository unavailable");
    });
    render(<AccountForm onCreateAccount={onCreateAccount} />);
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível cadastrar a conta."
    );
    expect(screen.getByRole("alert")).toHaveClass("text-red-700");
  });
});
