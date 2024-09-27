import type {ConfigContent} from "../schemas/ConfigContent.d.ts";
import Ajv from "ajv";
import AppConfigSchema from "../schemas/config";
import {ConfigValidationError} from "../errors";


export function validateConfig(config: unknown): ConfigContent {
  const ajv = new Ajv({allErrors: true, strict: false});
  const validate = ajv.compile(AppConfigSchema);
  const valid = validate(config);
  if (!valid) {
    throw new ConfigValidationError(validate.errors);
  }
  return config as ConfigContent;
}