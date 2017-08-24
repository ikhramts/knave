#!/usr/bin/env node
import * as process from 'process';
import { diff } from './diff';

const stdout = process.stdout;
const stderr = process.stderr;

var commands: {[id: string] : (args:string[]) => void} = {
    "diff": diff
}

function main(args: string[]) {
    if (args.length <= 2) {
        stderr.write("No command was selected.\n\n");
        printUsage();
        process.exit(1);
    }

    let commandName = args[2];
    let command = commands[commandName];

    if (!command) {
        stderr.write("Unknown command '" + commandName + "'.\n\n");
        printUsage();
        process.exit(1);
    }

    let commandArgs = args.slice(3);
    command(commandArgs);
}

function printUsage() {
    stdout.write("Available commands: \n\n");
    
    for (let commandName in commands) {
        stdout.write("  " + commandName + "\n");
    }

    stdout.write("\nType '<command> --help' to see available options\n");
}

main(process.argv);




