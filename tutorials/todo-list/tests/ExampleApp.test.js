import { runApp } from "@universal-packages/core";

describe("ExpressApp", () => {
  it("works", async () => {
    const stopApp = await runApp("example-app", { exitType: "throw" });

    await stopApp();
  });
});
