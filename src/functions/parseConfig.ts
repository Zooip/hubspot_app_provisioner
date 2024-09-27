import fs from "fs";
import {MissingConfigFileError} from "../errors";
import yaml from "js-yaml";
import {validateConfig} from "./validateConfig";

export function parseConfig(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new MissingConfigFileError(filePath);
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const content = yaml.load(fileContents);
  return validateConfig(content);
}