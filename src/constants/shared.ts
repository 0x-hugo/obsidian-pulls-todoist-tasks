export const FETCH_STRATEGIES: any = {
    today: "today",
    lastNHours: "lastNHours",
    fromFile: "fromFile",
};

export const NeverUpdated = "1970-01-01T00:00:00Z";

const prefixMap = {
    "done": "✅",
    "archived": "🗄️",
    "inprogress": "⚙️",
    "due": "📅",
    "recurring": "♺",
    "waiting": "⏳",
    "important": "❗️",
    "high": "🔼",
    "low": "🔽",
}
const priorityMap = {
    1: "low",
    2: "low",
    3: "high",
    4: "high",
}