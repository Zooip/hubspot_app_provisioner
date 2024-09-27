#!/usr/bin/env node

import 'dotenv-flow/config';
import {Command} from 'commander';
import debug from 'debug';
import {InternalError} from "./errors";
import {buildRunner} from "./functions/buildRunnerOptions";

function handleError(error: unknown) {
  if (error instanceof InternalError) {
    error.print();
    debug('hubspot_app_provisioner')(error);
  } else {
    console.error(error);
  }
  process.exit(1);
}

const program = new Command();

function applyDefaultOptions(command: Command): Command {
  return command.option('-c, --config <filepath>', 'Config file', '.hubspot_app_provisioner.yml')
    .option('-a, --app <id>', 'Hubspot application id. Also set by HUBSPOT_APP_ID environment variable')
    .option('-k, --key <key>', 'Hubspot API key. Also set by HUBSPOT_DEV_API_KEY environment variable')
    .option('-d, --domain <domain>', 'Hubspot application\'s root domain. Also set by HUBSPOT_APP_DOMAIN environment variable');
}


program
  .name('hubspot_app_provisioner')
  .description('Provision your HubSpot app using a YAML file')
applyDefaultOptions(program);

program.command('push')
  .action(async () => {
    try {
      const runner = buildRunner(program.opts());
      await runner.pushAll();
    } catch (error) {
      handleError(error);
    }
  });

applyDefaultOptions(program.command('cards'))
  .command('push')
  .argument('[filters...]', 'Filters to apply on cards', undefined)
  .action(async (filters) => {
    try {
      const runner = buildRunner(program.opts());
      await runner.pushCards(filters);
    } catch (error) {
      handleError(error);
    }
  });

applyDefaultOptions(program.command('timeline_events'))
  .command('push')
  .argument('[filters...]', 'Filters to apply on cards', undefined)
  .action(async (filters) => {
    try {
      const runner = buildRunner(program.opts());
      await runner.pushTimelineEvents(filters);
    } catch (error) {
      handleError(error);
    }
  });

try {
  program.parse(process.argv);
} catch (error) {
  handleError(error);
}


