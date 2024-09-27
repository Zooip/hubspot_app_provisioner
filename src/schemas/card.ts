import {JSONSchema4} from "json-schema";

export default {
  type: 'object',
  required: ['title', 'fetch'],
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      description: 'The title of the card'
    },
    fetch: {
      type: 'object',
      required: ['targetUrl', 'objectTypes'],
      additionalProperties: false,
      properties: {
        targetUrl: {
          type: 'string',
          description: 'The target URL of the card'
        },
        objectTypes: {
          type: 'array',
          description: 'The object types to fetch',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'propertiesToSend'],
            properties: {
              name: {
                type: 'string',
                description: 'The name of the object type',
                enum: ['contacts', 'companies', 'deals', 'marketing_events', 'tickets']
              },
              propertiesToSend: {
                type: 'array',
                description: 'The properties to fetch',
                items: {
                  type: 'string',
                  description: 'The name of the property'
                }
              }
            }
          }
        }
      }
    },
    display: {
      type: 'object',
      required: ['properties'],
      additionalProperties: false,
      properties: {
        properties: {
          type: 'array',
          description: 'The properties to display',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'dataType', 'label'],
            properties: {
              name: {
                type: 'string',
                description: 'The name of the property'
              },
              dataType: {
                type: 'string',
                description: 'The data type of the property'
              },
              label: {
                type: 'string',
                description: 'The label of the property'
              },
              options: {
                type: 'array',
                description: 'The options of the property',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name', 'label', 'type'],
                  properties: {
                    name: {
                      type: 'string',
                      description: 'The name of the option'
                    },
                    label: {
                      type: 'string',
                      description: 'The label of the option'
                    },
                    type: {
                      type: 'string',
                      description: 'The type of the option'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    actions: {
      type: 'object',
      additionalProperties: false,
      required: ['baseUrls'],
      properties: {
        baseUrls: {
          type: 'array',
          description: 'The base URLs of the actions',
          items: {
            type: 'string'
          }
        }
      }
    }
  }
} satisfies JSONSchema4
