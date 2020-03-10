const run = require("./cli");
const { version } = require("../package.json");

describe("run()", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    console.log = jest.fn();
  });

  it("should print package version for --version option", () => {
    run({ version: true });

    expect(console.log).toHaveBeenCalledWith(version);
  });
});
