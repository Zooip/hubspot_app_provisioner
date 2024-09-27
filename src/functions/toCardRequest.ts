import {RunnerCard} from "../Runner";
import {
  CardCreateRequest,
  CardDisplayPropertyDataTypeEnum,
  CardObjectTypeBodyNameEnum,
  DisplayOptionTypeEnum
} from "@hubspot/api-client/lib/codegen/crm/extensions/cards";
import {prefixDomain} from "./prefixDomain";
import {isProvisioningKey, toProvisioningKey} from "../provisioning_id";

function toCardObjectTypeBodyNameEnum(name: RunnerCard['fetch']['objectTypes'][number]['name']): CardObjectTypeBodyNameEnum {
  switch (name) {
    case 'contacts':
      return CardObjectTypeBodyNameEnum.Contacts;
    case 'companies':
      return CardObjectTypeBodyNameEnum.Companies;
    case 'deals':
      return CardObjectTypeBodyNameEnum.Deals;
    case 'marketing_events':
      return CardObjectTypeBodyNameEnum.MarketingEvents;
    case 'tickets':
      return CardObjectTypeBodyNameEnum.Tickets;
    default:
      throw new Error(`Unknown object type ${name}`);
  }
}

function toCardDisplayPropertyDataTypeEnum(dataType: NonNullable<RunnerCard['display']>['properties'][number]['dataType']): CardDisplayPropertyDataTypeEnum {
  switch (dataType) {
    case 'boolean':
      return CardDisplayPropertyDataTypeEnum.Boolean;
    case 'currency':
      return CardDisplayPropertyDataTypeEnum.Currency;
    case 'date':
      return CardDisplayPropertyDataTypeEnum.Date;
    case 'datetime':
      return CardDisplayPropertyDataTypeEnum.Datetime;
    case 'email':
      return CardDisplayPropertyDataTypeEnum.Email;
    case 'link':
      return CardDisplayPropertyDataTypeEnum.Link;
    case 'numeric':
      return CardDisplayPropertyDataTypeEnum.Numeric;
    case 'string':
      return CardDisplayPropertyDataTypeEnum.String;
    case 'status':
      return CardDisplayPropertyDataTypeEnum.Status;
    default:
      throw new Error(`Unknown data type ${dataType}`);
  }
}

function toDisplayOptionTypeEnum(type: NonNullable<NonNullable<RunnerCard['display']>['properties'][number]['options']>[number]['type']): DisplayOptionTypeEnum {
  switch (type) {
    case 'default':
      return DisplayOptionTypeEnum.Default;
    case 'success':
      return DisplayOptionTypeEnum.Success;
    case 'warning':
      return DisplayOptionTypeEnum.Warning;
    case 'danger':
      return DisplayOptionTypeEnum.Danger;
    case 'info':
      return DisplayOptionTypeEnum.Info;
    default:
      throw new Error(`Unknown option type ${type}`);
  }
}

export function typeAndInjectProvisioningId(properties: NonNullable<RunnerCard['display']>['properties'], provisioningId: string): CardCreateRequest['display']['properties'] {
  const result =  (properties).reduce((acc, property) => {
    if (isProvisioningKey(property.name)) {
      return acc;
    }
    return [...acc, {
      ...property,
      dataType: toCardDisplayPropertyDataTypeEnum(property.dataType),
      options: (property.options ?? []).map(option => {
        return {
          ...option,
          type: toDisplayOptionTypeEnum(option.type)
        }
      })
    }]
  }, [] as CardCreateRequest['display']['properties']);

  // inject provisioning id as first property
  result.unshift({
    name: toProvisioningKey(provisioningId),
    dataType: CardDisplayPropertyDataTypeEnum.String,
    label: 'DO NOT EDIT',
    options: []
  });

  return result;
}

export function toCardRequest(card: RunnerCard, provisioningId: string, domain: string | undefined): CardCreateRequest {
  return {
    ...card,
    fetch: {
      ...card.fetch,
      targetUrl: prefixDomain(domain, card.fetch.targetUrl),
      objectTypes: card.fetch.objectTypes.map(objectType => {
        return {
          ...objectType,
          name: toCardObjectTypeBodyNameEnum(objectType.name)
        }
      })
    },
    display: {
      properties: typeAndInjectProvisioningId(card.display?.properties ?? [], provisioningId)
    },
    actions: {
      baseUrls: (card.actions?.baseUrls ?? []).map(baseUrl => prefixDomain(domain, baseUrl))
    }
  }
}
