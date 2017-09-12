#!/usr/bin/env node

const fs = require("fs");
const { exec } = require("child_process");
const git = require("simple-git")(process.cwd());
const args = require("minimist")(process.argv.slice(2), {
  default: {
    dir: ".",
    install: true
  }
});
const commands = [
  `cd ${args.dir}`,
  "rm -rf .git",
  "rm package-lock.json",
  "rm yarn.lock",
  args.install ? "npm install" : ""
];

/**
 * Final commands that should be executed.
 *
 * @param {Object} err Error object.
 */
function finalCommands(err) {
  if (err) {
    console.log("bye!");
  }
  exec(commands.join(";"), () => {
    console.log("done");
  });
}

/**
 * Read package.json.
 *
 * @param {Function} cb Callback function.
 */
function pluckDeps(cb) {
  fs.readFile(
    `${process.cwd()}/${args.dir}/package.json`,
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      cb(data);
    }
  );
}

/**
 * Remove the old package.json.
 *
 * @param {Function} cb Callback function.
 * @param {Object} data Data read from the package.json file.
 */
function removeOldPackageJSON(cb, data) {
  exec(`rm ${process.cwd()}/${args.dir}/package.json`, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    cb(data);
  });
}

/**
 * Write a new package.json.
 *
 * @param {Object} data Data to write to the new package.json.
 */
function writeNewPackageJSON(data) {
  const { devDependencies, dependencies } = JSON.parse(data);
  const packageJSON = JSON.stringify(
    Object.assign(
      {},
      {
        name: "untitled",
        version: "1.0.0",
        scripts: {
          start: "webpack-dev-server",
          build: "webpack --devtool source-map --output-pathinfo -p"
        }
      },
      { devDependencies, dependencies }
    )
  );
  fs.writeFile(`${args.dir}/package.json`, packageJSON, finalCommands);
}

/**
 * Clone the repo and execute a callback.
 *
 * @param {String} branch The branch to clone from.
 */
function clone(branch = "") {
  const cloneArgs = branch !== "" ? ["-b", branch] : [];
  console.log(`Cloning a ${args._[0]} app into ${args.dir}.`);
  git.clone(
    "https://github.com/zgreen/webpack-boilerplate/",
    args.dir,
    cloneArgs,
    () => {
      // Pluck the dependencies.
      pluckDeps(removeOldPackageJSON.bind(null, writeNewPackageJSON));
    }
  );
}

clone(args._[0])
