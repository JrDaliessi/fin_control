import "@testing-library/jest-dom/jest-globals";
import { deserialize, serialize } from "node:v8";

if (!globalThis.structuredClone) {
  Object.defineProperty(globalThis, "structuredClone", {
    configurable: true,
    value: <Value>(value: Value) => deserialize(serialize(value)) as Value,
    writable: true
  });
}

if (!globalThis.fetch) {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: async () => {
      throw new Error("unexpected fetch call in the Jest environment");
    },
    writable: true
  });
}
