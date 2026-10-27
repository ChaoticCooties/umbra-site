import { getCollection, type CollectionEntry } from 'astro:content';

export type Advisory = CollectionEntry<'advisories'>;

/** Disclosed advisories only, newest first. Drafts and embargoed entries never build. */
export async function disclosedAdvisories(): Promise<Advisory[]> {
  return (await getCollection('advisories'))
    .filter((entry) => entry.data.status === 'Disclosed')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const identifiers = (a: Advisory) =>
  (a.data.cve ?? a.data.identifier ?? '').split(/,\s*/).filter(Boolean);

export const target = (a: Advisory) => `${a.data.vendor}${a.data.product ? ` / ${a.data.product}` : ''}`;

/** The summary's first sentence, used as the one-line description in the register. */
export const leadSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
