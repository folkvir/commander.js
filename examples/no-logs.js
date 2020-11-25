#!/usr/bin/env node

// This example shows how to disable logs and how to re-enable them:
// The program should prints the following
// begin
// error: unknown option '--version'
// log-disabled: error: unknown option '--HELPME'
// error: unknown option '--endme'
// subcommands: add = 8
// end

console.log(process.argv)
// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.0.1', '-v, --VERSION', 'new version message')
  .option('-s, --sessions', 'add session support')
  .option('-t, --template <engine>', 'specify template engine (jade|ejs) [jade]', 'jade');

console.log('begin')
// do not exit after parsing
program.exitOverride()


program._loggers.stdout = (...val) => {
  // return the version specified when --version is specified
  if (val[0] === "0.0.1\n") {
    console.log('no-log: good')
  }
}

try {
  // should print "1-good" not more, not less :)
  program.parse(["nothing", "nothing", "--version"])
} catch (error) {
  // it still throws an error but normal behavior with program.exitOverride()
  // and it logs it because it is specified
}


// should not print anything
program._loggers.error = (_) => undefined
try {
  program.parse(["nothing", "nothing", "--HELPME"])
  
} catch (error) {
  // it still throws an error but normal behavior with program.exitOverride()
  // error but it's good we dont have a good option
  console.log("log-disabled: " + error.message)
}


// should be back to normal
try {
  // back to normal
  // should not print anything
program._loggers.error = console.error
  program.parse(["nothing", "nothing", "--endme"])
} catch (error) {
  // it still throws an error but normal behavior with program.exitOverride()
  // and it prints the error as always
}

// now with subcommands
const cmd = new Command('add')
cmd.option('-n <number>', 'add 1 + to the number', parseInt)
cmd.action((obj) => {
  // accepted logs because we wanted it
  console.log('subcommands: add = ' + (obj.n + 1))
})

program.addCommand(cmd)
// disable error logs
program._loggers.error = (_) => undefined
try {
  
  const args = "add '\"'\"\'{'\"##thismysthicalthingsworks\###\"\#' ' -n 7".match(/("([^"]*)")|('([^']*)')|(\S+)/g)
  console.log(args)
  program.parse(["", "", ...args])
} catch (error) {
  // console.log(error)
}
console.log("end")