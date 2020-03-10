#!/usr/bin/env node
const yargs = require("yargs");
const run = require("../src/cli");
const { name } = require("../package.json");

const argv = yargs
  .command("new [app]", "create a new docker app", args => {
    args.positional("app", "name of the app");
  })
  .option("version", {
    alias: "v",
    description: `version of ${name}`
  }).argv;

run(argv);
