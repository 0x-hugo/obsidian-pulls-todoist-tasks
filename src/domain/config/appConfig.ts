import { ObsidianAppSettings } from "../../infrastructure/obsidian/pluginSettings";
import { AppSettings } from "../types";

export const convertToAppConfig = (settings: ObsidianAppSettings): AppSettings => ({
  keywordSegmentStart: settings.keywordSegmentStart,
  keywordSegmentEnd: settings.keywordSegmentEnd,
  authToken: settings.authToken,
});