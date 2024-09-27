import cardSchema from './card';
import timelineEventSchema from './timeline_event';
import {JSONSchema4} from "json-schema";

export default {
  type: 'object',
  additionalProperties: false,
  properties: {
    domain: {
      type: 'string',
      description: 'The domain of your HubSpot app'
    },
    appId: {
      type: 'number',
      description: 'The ID of your HubSpot app'
    },
    cards: {
      type: 'object',
      description: 'The cards to provision',
      additionalProperties: cardSchema
    },
    timeline_events: {
      type: 'object',
      description: 'The timeline events to provision',
      additionalProperties: timelineEventSchema
    }
  }
} satisfies JSONSchema4