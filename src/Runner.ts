import {ConfigContent} from "./schemas/ConfigContent";
import {Client as HubspotClient} from "@hubspot/api-client";
import {fetchCardsRepository} from "./functions/fetchCardsRepository";
import {log} from "./logger";
import {toCardRequest} from "./functions/toCardRequest";
import {CardPatchRequest} from "@hubspot/api-client/lib/codegen/crm/extensions/cards";
import {fetchTimelineEventsRepository} from "./functions/fetchTimelineEventsRepository";
import {toTimelineEventRequest} from "./functions/toTimelineEventRequest";
import {TimelineEventTemplateUpdateRequest} from "@hubspot/api-client/lib/codegen/crm/timeline";

function filter<T>(obj: Record<string, T>, filters: string[]): Record<string, T> {
  if (filters.length === 0) return obj;
  return Object.fromEntries(Object.entries(obj).filter(([key]) => filters.includes(key)));
}


export type RunnerCards = NonNullable<ConfigContent['cards']>;
export type RunnerCard = RunnerCards[string];
export type RunnerTimelineEvents = NonNullable<ConfigContent['timeline_events']>;
export type RunnerTimelineEvent = RunnerTimelineEvents[string];


export type RunnerOptions = {
  appId: number
  domain: string | undefined
  client: HubspotClient,
  cards: RunnerCards
  timelineEvents: RunnerTimelineEvents
}

export default class Runner {
  private appId: number;
  private domain: string | undefined;
  private client: HubspotClient;
  private cards: RunnerCards;
  private timelineEvents: RunnerTimelineEvents;


  constructor({appId, domain, client, cards, timelineEvents}: RunnerOptions) {
    this.appId = appId;
    this.domain = domain;
    this.client = client;
    this.cards = cards;
    this.timelineEvents = timelineEvents;
  }

  async pushAll(){
    this.pushCards([]);
    this.pushTimelineEvents([]);
  }

  async pushCards(filters: string[]) {
    const cardsRecord = filter(this.cards, filters);

    if (Object.keys(cardsRecord).length === 0) {
      log('No cards to push');
      console.log('No cards to push');
      return;
    }

    log(`Found ${Object.keys(cardsRecord).length} cards to push : ${Object.keys(cardsRecord)}`);

    const cardRepo = await fetchCardsRepository(this.client, this.appId);

    Object.entries(cardsRecord).forEach(([provisioningId, card]) => {
      const hubspotId = cardRepo.idMap[provisioningId];
      if (hubspotId) {
        log(`Card '${provisioningId}' already exists in HubSpot, updating`);
        this.client.crm.extensions.cards.cardsApi.update(hubspotId, this.appId, toCardRequest(card, provisioningId, this.domain) as CardPatchRequest);
        console.log(`Card '${provisioningId}' updated in HubSpot (${card.title})`);
      } else {
        log(`Card '${provisioningId}' does not exist in HubSpot, creating`);
        this.client.crm.extensions.cards.cardsApi.create(this.appId, toCardRequest(card, provisioningId, this.domain));
        console.log(`Card '${provisioningId}' created in HubSpot (${card.title})`);
      }
    })
  }

  async pushTimelineEvents(filters: string[]) {
    const timelineEventsRecord = filter(this.timelineEvents, filters);

    if (Object.keys(timelineEventsRecord).length === 0) {
      console.log('No timeline events to push');
      return;
    }

    log(`Found ${Object.keys(timelineEventsRecord).length} timeline events to push : ${Object.keys(timelineEventsRecord)}`);

    const timelineEventsRepo = await fetchTimelineEventsRepository(this.client, this.appId);

    Object.entries(timelineEventsRecord).forEach(([provisioningId, timelineEvent]) => {
      const hubspotId = timelineEventsRepo.idMap[provisioningId];
      if (hubspotId) {
        log(`Timeline event '${provisioningId}' already exists in HubSpot, updating`);
        this.client.crm.timeline.templatesApi.update(
          hubspotId,
          this.appId,
          {
            ...toTimelineEventRequest(timelineEvent, provisioningId, this.domain),
            id: hubspotId
          }
        );
        console.log(`Timeline event '${provisioningId}' updated in HubSpot (${timelineEvent.name})`);
      } else {
        log(`Timeline event '${provisioningId}' does not exist in HubSpot, creating`);
        this.client.crm.timeline.templatesApi.create(
          this.appId,
          toTimelineEventRequest(timelineEvent, provisioningId, this.domain));
        console.log(`Timeline event '${provisioningId}' created in HubSpot (${timelineEvent.name})`);
      }
    })
  }
}
