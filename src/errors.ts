import {ErrorObject} from "ajv";

export abstract class InternalError extends Error {
  public print(){
    console.error(this.message);
  }
}

export class ConfigValidationError extends InternalError {
  public errors: ErrorObject[] | null | undefined;

  constructor(errors: ErrorObject[] | null | undefined) {
    super('Configuration validation failed.');
    this.errors = errors;
  }

  public print() {
    if (!this.errors) return;

    this.errors.forEach((error, index) => {
      console.error(
        `  ${index + 1}. Error in ${error.instancePath || 'root'}: ${error.message}`
      );
      if (error.params.missingProperty) {
        console.error(`     Missing property: ${error.params.missingProperty}`);
      }
    });
  }
}

export class MissingConfigFileError extends InternalError {
  constructor(filePath: string) {
    super(`Configuration file not found: ${filePath}`);
  }
}

export class MissingOptionError extends InternalError {
  constructor(optionName: string, configName: string | undefined, envName: string | undefined) {

    const configUsage = configName ? `'${configName}' in your config file` : undefined;
    const envUsage = envName ? `${envName} environment variable` : undefined;

    const hints = [configUsage, envUsage].filter(Boolean);
    const message = hints.length > 0 ? `Missing option '${optionName}'. You can set it using ${hints.join(' or ')}` : `Missing option '${optionName}'`;

    super(message);
  }
}

export class MissingDomainError extends InternalError {
  constructor() {
    super('Domain is required when using relative URLs');
  }
}