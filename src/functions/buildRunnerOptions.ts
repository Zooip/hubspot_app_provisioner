import {OptionValues} from "commander";
import {parseConfig} from "./parseConfig";
import {ConfigContent} from "../schemas/ConfigContent";
import Runner, {RunnerOptions} from "../Runner";
import {MissingOptionError} from "../errors";
import {Client as HubspotClient} from "@hubspot/api-client";

type ExtractOption<TConfigKey extends keyof ConfigContent> = {
  optName: keyof OptionValues;
  // Key of ConfigContent which returns a T
  configName?: TConfigKey;
  envName?: string;
  mandatory: boolean;
}


class OptionExtractor {
  private opts: OptionValues;
  private config: ConfigContent;

  constructor(opts: OptionValues, config: ConfigContent) {
    this.opts = opts;
    this.config = config;
  }

  extract<TConfigKey extends (keyof ConfigContent & string)>({optName, configName, envName, mandatory}: ExtractOption<TConfigKey>): string | ConfigContent[TConfigKey]    {
    if (this.opts[optName]) {
      return this.opts[optName];
    }
    if (envName && process.env[envName]) {
      return process.env[envName];
    }
    if (configName && this.config[configName]) {
      return this.config[configName];
    }
    if (mandatory) {
      throw new MissingOptionError(optName,configName,envName);
    }
    return undefined;
  }

  get appId(): number {
    return Number(this.extract({
      optName: 'app',
      configName: 'appId',
      envName: 'HUBSPOT_APP_ID',
      mandatory: true
    }));
  }

   get domain(): string | undefined {
    return this.extract({
      optName: 'domain',
      configName: 'domain',
      envName: 'HUBSPOT_APP_DOMAIN',
      mandatory: false
    });
  }

  get hubspotDevKey(): string {
    return this.extract({
      optName: 'key',
      envName: 'HUBSPOT_DEV_API_KEY',
      mandatory: true
    }) as string;
  }

}

export function buildRunner(opts: OptionValues): Runner {
  const config = parseConfig(opts.config);
  const extractor = new OptionExtractor(opts, config);

  const client = new HubspotClient({
    developerApiKey: extractor.hubspotDevKey
  });

  return new Runner({
    appId: extractor.appId,
    domain: extractor.domain,
    client: client,
    cards: config.cards ?? {},
    timelineEvents: config.timeline_events ?? {}
  })
}