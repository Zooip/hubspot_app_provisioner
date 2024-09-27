export const PROVISIONING_IDENTIFIER_PREFIX = '_PROV_ID-'

export function toProvisioningKey(key: string): string {
  return `${PROVISIONING_IDENTIFIER_PREFIX}${key}`;
}

export function fromProvisioningKey(key: string): string {
  return key.substring(PROVISIONING_IDENTIFIER_PREFIX.length);
}

export function isProvisioningKey(key: string): boolean {
  return key.startsWith(PROVISIONING_IDENTIFIER_PREFIX);
}