import events from "./zh/events.ts";
import gateway from "./zh/gateway.ts";
import lint from "./zh/lint.ts";
import other from "./zh/other.ts";
import tasks from "./zh/tasks.ts";

const zhConfigs = {
    ...events,
    ...tasks,
    ...gateway,
    ...lint,
    ...other
} as any;

const customTranslate = (template: string, replacements: any) => {
    replacements = replacements || {};
    // Translate
    const templateLower = template.toLowerCase();
    const translationKeys = Object.keys(zhConfigs)
    const matchedKey = translationKeys.find((key: string) => key.toLowerCase() === templateLower)

    template = matchedKey ? zhConfigs[matchedKey as keyof typeof zhConfigs] : template
    // Replace
    return template.replace(/{([^}]+)}/g, function (_, key) {
        return replacements[key] || '{' + key + '}';
    });
}

export default {
    translate: ['value', customTranslate],
}