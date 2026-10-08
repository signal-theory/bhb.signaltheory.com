import type { ChecklistGroup, SiteContent, StateContent } from "./types";
import siteJson from "./site.json";
import checklistJson from "./checklist.json";
import missouri from "./states/missouri.json";
import kansas from "./states/kansas.json";
import texas from "./states/texas.json";

export const site = siteJson as SiteContent;
export const checklist = checklistJson as ChecklistGroup[];

const states = [missouri, kansas, texas] as StateContent[];

export function getStates(): StateContent[] {
  return states;
}

export function getState(slug: string): StateContent | undefined {
  return states.find((s) => s.slug === slug);
}

export const stateSlugs = states.map((s) => s.slug);
