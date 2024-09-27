import {JSONSchema4} from "json-schema";

export default {
  type: 'object',
  required: ['name', 'objectType'],
  properties: {
    name: {
      type: 'string',
      description: 'The name of the timeline event'
    },
    objectType: {
      type: 'string',
      description: 'The object type of the timeline event',
      enum: ['contacts', 'companies', 'deals', 'tickets']
    },
    headerTemplate: {
      type: 'string',
      description: 'The header template of the timeline event'
    },
    detailTemplate: {
      type: 'string',
      description: 'This uses Markdown syntax with Handlebars and event-specific data to render HTML on a timeline when you expand the details.'
    },
    tokens: {
      type: 'array',
      description: 'The tokens of the timeline event',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'label', 'type'],
        properties: {
          name: {
            type: 'string',
            description: 'The name of the token'
          },
          label: {
            type: 'string',
            description: 'The label of the token'
          },
          type: {
            type: 'string',
            description: 'The type of the token',
            enum: ['date', 'enumeration', 'number', 'string']
          },
          options: {
            type: 'array',
            description: 'The options of the token if enum',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['value', 'label'],
              properties: {
                value: {
                  type: 'string',
                  description: 'The name of the option'
                },
                label: {
                  type: 'string',
                  description: 'The label of the option'
                }
              }
            }
          },
          objectPropertyName: {
            type: 'string',
            description: 'The name of the CRM object property. This will populate the CRM object property associated with the event.'
          }
        }
      }
    }
  }
} satisfies JSONSchema4