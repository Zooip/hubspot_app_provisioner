import {MissingDomainError} from "../errors";

export function prefixDomain(domain: string | undefined, url: string): string {
  if (url.startsWith('/')) {
    if (!domain) {
      throw new MissingDomainError();
    }

    // add https:// to domain if missing
    if (!domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    // remove leading slash if present in domain
    if (domain.endsWith('/')) {
      domain = domain.substring(0, domain.length - 1);
    }
    return `${domain}${url}`;
  }
  return url;
}