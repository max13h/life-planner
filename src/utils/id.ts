export const generateId = (prefix: string = ""): string => {
  const uuid = crypto.randomUUID();
  return `${prefix ? prefix + "-" : ""}${uuid.slice(0, 8)}`;
};