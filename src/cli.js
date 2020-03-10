const { version } = require("../package.json");

function run(argv) {
  if (argv.version) {
    console.log(version);
  }
}

module.exports = run;
