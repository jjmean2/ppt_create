export interface LyricTextHistory {
  /** milliseconds */
  timestamp: number;
  isSavedByUser: boolean;
  content: string;
  titles: string[];
}
