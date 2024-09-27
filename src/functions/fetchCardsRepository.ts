import {Client as HubspotClient} from "@hubspot/api-client";
import {PublicCardResponse} from "@hubspot/api-client/lib/codegen/crm/extensions/cards";
import {log} from "../logger";
import {fromProvisioningKey, isProvisioningKey} from "../provisioning_id";


type CardsRepository = {
  idMap: Record<string, string>
  cards: PublicCardResponse[]
  unknownIds: string[]
}

export async function fetchCardsRepository(client: HubspotClient, appId: number): Promise<CardsRepository> {
  log('Fetching cards repository...');
  const cardsResponse = await client.crm.extensions.cards.cardsApi.getAll(appId);

  const cards = cardsResponse.results;


  const unknownIds = []
  const idMap: Record<string, string> = {};

  for (const card of cards) {
    log(`  Analysing card ${card.id} - ${card.title}`);
    let provisioningId
    // search for provisioning id in properties
    card.display.properties.forEach((property) => {
      if(isProvisioningKey(property.name)) {
        provisioningId = fromProvisioningKey(property.name);
      }
    })

    if (provisioningId) {
      log(`    Found provisioning id ${provisioningId}`);
      idMap[provisioningId] = card.id;
    } else {
      log(`    No provisioning id found`);
      unknownIds.push(card.id);
    }
  }

  return {
    idMap: idMap,
    cards: cards,
    unknownIds: unknownIds
  }

}