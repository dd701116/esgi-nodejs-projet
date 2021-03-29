const assert = require('assert');
const fs = require('fs');

describe("The default config", () => {
  it(`Should be exists`, async () => {
    assert(fs.existsSync("config.default.json"));
  });
});
