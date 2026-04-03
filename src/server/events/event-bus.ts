export type AppEvent = {
  type: string;
  payload: Record<string, unknown>;
};

export async function publishEvent(event: AppEvent) {
  return event;
}
