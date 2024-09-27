import * as fs from 'fs';
import { compile } from 'json-schema-to-typescript';
import type { JSONSchema4 } from 'json-schema';
import schema from './src/schemas/config';

compile(schema as JSONSchema4 , 'ConfigContent').then((ts) => {
  fs.writeFileSync('./src/schemas/ConfigContent.d.ts', ts);
});