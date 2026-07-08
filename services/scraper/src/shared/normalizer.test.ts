import assert from "node:assert/strict";
import { test } from "node:test";

import { buildImportJob } from "./normalizer";

test("buildImportJob infers remote classification", () => {
  const payload = buildImportJob(
    {
      companyName: "Example",
      companyWebsite: "https://example.com",
      boardToken: "example",
      ats: "generic",
    },
    {
      title: "Senior Engineer",
      applyUrl: "https://example.com/careers/senior-engineer",
      location: "Remote - US",
      source: "Generic HTML",
      sourcePlatform: "generic-html",
    },
  );

  assert.equal(payload.remoteType, "Remote");
  assert.equal(payload.companyName, "Example");
  assert.equal(payload.title, "Senior Engineer");
});
