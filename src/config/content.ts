import content from "./content.json";

type TemplateValue = number | string;

export function formatText(
  template: string,
  values: Record<string, TemplateValue>,
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
    const value = values[key];
    return value === undefined ? placeholder : String(value);
  });
}

export { content };
