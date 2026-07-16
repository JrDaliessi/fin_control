import { describe, expect, it } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readCiWorkflow(): string {
  return readFileSync(
    join(process.cwd(), ".github", "workflows", "ci.yml"),
    "utf-8",
  );
}

function getTriggerBranches(source: string, trigger: string): string[] {
  const triggerPattern = new RegExp(
    `^  ${trigger}:\\r?\\n\\s+branches:\\s*\\[([^\\]]+)\\]`,
    "m",
  );
  const match = source.match(triggerPattern);

  return match?.[1]
    .split(",")
    .map((branch) => branch.trim()) ?? [];
}

describe("Quality Gates workflow", () => {
  it("validates integration and release branches on pushes and pull requests", () => {
    const workflow = readCiWorkflow();

    expect(getTriggerBranches(workflow, "push")).toEqual(
      expect.arrayContaining(["develop", "main"]),
    );
    expect(getTriggerBranches(workflow, "pull_request")).toEqual(
      expect.arrayContaining(["develop", "main"]),
    );
  });
});
