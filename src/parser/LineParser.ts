import { SongParser, SongPart } from "./SongParser";
import { $enum } from "ts-enum-util";
import { Optional } from "utility-types";

export enum LineCategory {
  empty,
  linkUrl,
  tag,
  flow,
  title,
  comment,
  body,
  date,
  separator,
  unknown,
}

const tagPatterns = [
  /^(V\d?E?['"]*)$/i,
  /^(P?C\d?E?['"]*)$/i,
  /^(B\d?['"]*)$/i,
  /^(E(nding)?\d?['"]*)$/i,
  /^\[([\w\d]+['"]*)\]$/i,
  /^#([\w\d]+['"]*)$/i,
];
export const isTag = (arg: string) =>
  tagPatterns.some((pattern) => pattern.test(arg));
const flowTokenDelimiterPattern = /[^'"\w\d)(가-힣]+/;
export const flowTokenPatterns = [
  ...tagPatterns,
  /^\(?x\d\)?$/i,
  /^간주$/,
  /^조용히$/,
  /^\([가-힣]+\)$/,
];
export const isFlowToken = (arg: string): boolean =>
  flowTokenPatterns.some((pattern) => pattern.test(arg));
export const splitAsTokens = (arg: string): string[] =>
  arg.split(flowTokenDelimiterPattern).filter((token) => Boolean(token));

const separatorPatterns = [/^[-=*][-=* ]+[-=*]$/];
const isSeparator = (arg: string) =>
  separatorPatterns.some((pattern) => pattern.test(arg));

const metaNames = ["title", "flow"] as const;
type MetaName = typeof metaNames[number];

export const metaLinePattern = /^@([\w-]+):/i;
function getMetaNameInLine(line: string): string | null {
  const matches = line.match(metaLinePattern);
  if (matches === null) {
    return null;
  }
  return matches[1];
}
function getSingleMatchedMetaName(line: string): MetaName | null {
  const lineMetaName = getMetaNameInLine(line);
  if (lineMetaName === null) {
    return null;
  }
  const matchedMetaName = metaNames.filter((metaName) =>
    metaName.startsWith(lineMetaName)
  );
  if (matchedMetaName.length !== 1) {
    return null;
  }
  return matchedMetaName[0];
}

const scoreRange = {
  certain: 5,
  notPossible: 0,
};

const titleSections = [
  LineCategory.title,
  LineCategory.flow,
  LineCategory.linkUrl,
];

type Scorer = (text: string) => number | undefined;
const categoryScorer: Partial<Record<LineCategory, Scorer>> = {
  [LineCategory.empty]: (text) =>
    text === "" ? scoreRange.certain : scoreRange.notPossible,
  [LineCategory.date]: (text) => undefined,
  [LineCategory.title]: (text) => {
    const metaName = getSingleMatchedMetaName(text);
    if (metaName === "title") {
      return scoreRange.certain;
    }
    let score = 0;
    if (/^\d\. /.test(text)) {
      score += 2;
    }
    if (/\(\w\)$/.test(text)) {
      score += 2;
    }
    if (/\(\w->\w\)$/.test(text)) {
      score += 1;
    }
    return score;
  },
  [LineCategory.linkUrl]: (text) =>
    /^https?:\/\/.*$/.test(text) ? scoreRange.certain : scoreRange.notPossible,
  [LineCategory.flow]: (text) => {
    const metaName = getSingleMatchedMetaName(text);
    if (metaName === "flow") {
      return scoreRange.certain;
    }

    const tokens = splitAsTokens(text);
    if (tokens.length === 1) {
      return scoreRange.notPossible;
    }
    const flowTokens = tokens.filter(isFlowToken);
    if (flowTokens.length === 1) {
      return scoreRange.notPossible;
    }
    const flowTokenRatio = flowTokens.length / tokens.length;
    const invalidFlowTokenCount = tokens.length - flowTokens.length;

    if (tokens.length > 3 && flowTokenRatio === 1) {
      return 4;
    }
    if (tokens.length > 7 && invalidFlowTokenCount <= 2) {
      return 4;
    }
    if (tokens.length > 10 && invalidFlowTokenCount <= 3) {
      return 4;
    }
    return 1;
  },
  [LineCategory.tag]: (text) => {
    if (isTag(text)) {
      return scoreRange.certain;
    }
    if (/^[A-Z]{,2}\d?$/i.test(text)) {
      return 3;
    }
  },
  [LineCategory.body]: (text) => {
    // if (/^[\w\d,"'.)(/ -]+$/i.test(text)) {
    //   return 2;
    // }
    // return 1;
    return 2;
  },
  [LineCategory.comment]: (text) => {
    if (/[가-힣]+/.test(text)) {
      return 2;
    }
    return 0;
  },
  [LineCategory.separator]: (text) =>
    isSeparator(text) ? scoreRange.certain : scoreRange.notPossible,
};

class Line {
  inferedCategory: {
    value: LineCategory;
    score: number;
  };
  constructor(public text: string) {
    const categories = $enum(LineCategory).getValues();
    this.inferedCategory = categories.reduce((result, current) => {
      if (result?.score === scoreRange.certain) {
        return result;
      }
      const checker = categoryScorer[current];
      const score = checker?.(text);
      if (score !== undefined && score > (result?.score ?? -1)) {
        return { value: current, score: score };
      }
      return result;
    }, undefined as { value: LineCategory; score: number } | undefined) ?? {
      value: LineCategory.unknown,
      score: 5,
    };
  }
}

export class LineParser {
  lines: Line[];
  private songsCache?: SongParser[];
  done = false;
  constructor(text: string) {
    this.lines = text
      .trim()
      .split("\n")
      .map(($0) => $0.trim())
      .reduce((result, current) => {
        const lastLine = result[result.length - 1] ?? "";
        if (!(current === "" && lastLine.text === "")) {
          result.push(new Line(current));
        }
        return result;
      }, [] as Line[]);
    console.log(
      this.lines.map(($0) => ({
        text: $0.text,
        category: $enum(LineCategory).getKeyOrDefault($0.inferedCategory.value),
      }))
    );
  }

  songs(): SongParser[] {
    if (this.songsCache) {
      return this.songsCache;
    }
    const songParts = this.getSongParts();
    const songs: SongPart[][] = [];

    let startIndexOfSong = 0;
    let processedLineIndex = 0;
    for (const [currentIndex, currentPart] of Array.from(songParts.entries())) {
      if (currentIndex <= processedLineIndex) {
        continue;
      }
      if (currentPart.category === LineCategory.separator) {
        const previousParts = songParts.slice(startIndexOfSong, currentIndex);
        if (isCompleteSong(previousParts)) {
          songs.push(previousParts);
          startIndexOfSong = currentIndex;
        }
      } else if (titleSections.includes(currentPart.category)) {
        const firstBodyIndexAfterThis = songParts
          .slice(currentIndex)
          .findIndex(($0) => $0.category === LineCategory.body);
        if (firstBodyIndexAfterThis === -1) {
          processedLineIndex = Number.MAX_SAFE_INTEGER;
        } else {
          processedLineIndex = firstBodyIndexAfterThis;
          const categoriesInTitleSection = songParts
            .slice(currentIndex, currentIndex + firstBodyIndexAfterThis)
            .map(($0) => $0.category);
          if (
            categoriesInTitleSection.includes(LineCategory.title) ||
            categoriesInTitleSection.includes(LineCategory.flow) ||
            categoriesInTitleSection.includes(LineCategory.linkUrl)
          ) {
            const previousParts = songParts.slice(
              startIndexOfSong,
              currentIndex
            );
            if (isCompleteSong(previousParts)) {
              songs.push(previousParts);
              startIndexOfSong = currentIndex;
            }
          }
        }
      }
    }
    const remainingParts = songParts.slice(startIndexOfSong);
    if (isCompleteSong(remainingParts)) {
      songs.push(remainingParts);
    }

    this.songsCache = songs.map(($0) => new SongParser($0));
    return this.songsCache;
  }

  getSongParts(): SongPart[] {
    const songParts = [] as Optional<SongPart, "end" | "lines">[];
    this.lines.forEach((line, index) => {
      const last = songParts[songParts.length - 1];
      if (last === undefined) {
        songParts.push({ start: index, category: line.inferedCategory.value });
      } else if (last.category !== line.inferedCategory.value) {
        last.end = index;
        songParts.push({ start: index, category: line.inferedCategory.value });
      }
    });
    if (songParts[songParts.length - 1]) {
      songParts[songParts.length - 1].end = this.lines.length;
    }
    return songParts.flatMap((part) => {
      const { start, end, category } = part;
      if (end === undefined) {
        return [];
      }
      return [
        {
          start,
          end,
          category,
          lines: this.lines.slice(start, end).map(($0) => $0.text),
        },
      ];
    });
  }
}

function isCompleteSong(songParts: SongPart[]): boolean {
  return songParts.filter(($0) => $0.category === LineCategory.body).length > 0;
}
