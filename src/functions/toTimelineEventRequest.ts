import {RunnerTimelineEvent} from "../Runner";
import {
  TimelineEventTemplateCreateRequest,
  TimelineEventTemplateToken, TimelineEventTemplateTokenTypeEnum
} from "@hubspot/api-client/lib/codegen/crm/timeline";
import {isProvisioningKey, toProvisioningKey} from "../provisioning_id";


function toTimelineEventTemplateTokenTypeEnum(type: NonNullable<NonNullable<RunnerTimelineEvent['tokens']>[number]['type']>): TimelineEventTemplateToken['type'] {
  switch (type) {
    case 'date':
      return TimelineEventTemplateTokenTypeEnum.Date;
    case 'enumeration':
      return TimelineEventTemplateTokenTypeEnum.Enumeration;
    case 'number':
      return TimelineEventTemplateTokenTypeEnum.Number;
    case 'string':
      return TimelineEventTemplateTokenTypeEnum.String;
    default:
      throw new Error(`Unknown type ${type}`);
  }
}

type RequestTokens = TimelineEventTemplateCreateRequest['tokens']
type RequestToken = RequestTokens[number]
function handleTokens(tokens: RunnerTimelineEvent['tokens'], provisioningId: string): RequestTokens {
  const result: RequestTokens = (tokens ?? []).reduce<RequestTokens>((acc, token) => {
    if(isProvisioningKey(token.name)) {
      return acc;
    }

    return [
      ...acc,
      {
        ...token,
        type: toTimelineEventTemplateTokenTypeEnum(token.type),
      }
    ];

  }, []);

  // inject provisioning id as first property
  result.unshift({
    name: toProvisioningKey(provisioningId),
    type: TimelineEventTemplateTokenTypeEnum.String,
    label: 'DO NOT EDIT'
  });

  return result;
}

export function toTimelineEventRequest(timelineEvent: RunnerTimelineEvent, provisioningId: string, domain: string | undefined): TimelineEventTemplateCreateRequest {
  return {
    ...timelineEvent,
    tokens: handleTokens(timelineEvent.tokens, provisioningId),
  }
}