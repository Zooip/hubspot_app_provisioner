import {Client as HubspotClient} from "@hubspot/api-client";
import {log} from "../logger";
import {TimelineEventTemplate} from "@hubspot/api-client/lib/codegen/crm/timeline";
import {fromProvisioningKey, isProvisioningKey} from "../provisioning_id";

export type TimelineEventsRepository = {
  idMap: Record<string, string>
  timelineEvents:  TimelineEventTemplate[]
  unknownIds: string[]
}

export async function fetchTimelineEventsRepository(client: HubspotClient, appId: number): Promise<TimelineEventsRepository> {
  log('Fetching timeline events repository...');
  const timelineEventsResponse = await client.crm.timeline.templatesApi.getAll(appId);

  const timelineEvents = timelineEventsResponse.results;

  const unknownIds = []
  const idMap: Record<string, string> = {};

  for (const timelineEvent of timelineEvents) {
    log(`  Analysing timeline event ${timelineEvent.id} - ${timelineEvent.name}`);
    let provisioningId
    // search for provisioning id in properties
    timelineEvent.tokens.forEach((token) => {
      if(isProvisioningKey(token.name)) {
        provisioningId = fromProvisioningKey(token.name);
      }
    })

    if (provisioningId) {
      log(`    Found provisioning id ${provisioningId}`);
      idMap[provisioningId] = timelineEvent.id;
    } else {
      log(`    No provisioning id found`);
      unknownIds.push(timelineEvent.id);
    }
  }

  return {
    idMap: idMap,
    timelineEvents: timelineEvents,
    unknownIds: unknownIds
  }
}