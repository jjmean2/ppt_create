import { LineCategory, splitAsTokens } from "./LineParser";

function trimEachLine(text: string) {
  return text
    .split("\n")
    .map(($0) => $0.trim())
    .join("\n");
}

function capitalizeEachLine(text: string) {
  return text
    .split("\n")
    .map(($0) => ($0[0]?.toUpperCase() ?? "") + $0.slice(1))
    .join("\n");
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function convertBodyToSlide(body: Body, delimiter: string): Slide[] {
  const lineDelim = new RegExp(`\\n?${escapeRegExp(delimiter)}\\n?`, "g");
  const slideDelim = new RegExp(
    `\\n?${escapeRegExp(`${delimiter}${delimiter}`)}\\n?`,
    "g"
  );
  const slideTerm = /\n\n+/g;

  const { tag, lines } = body;
  console.log("## lines", lines);
  const delimProcessed = lines
    .map(($0) => $0.trim())
    .join("\n")
    .replace(slideDelim, "\n\n")
    .replace(lineDelim, "\n");
  const processed = capitalizeEachLine(trimEachLine(delimProcessed))
    .split(slideTerm)
    .filter(($0) => /^(?!\s*$).+/.test($0));

  console.log("## processed", processed);
  if (processed.length === 0) {
    processed.push("");
  }
  return processed.map((slideBody) => ({
    tag: tag,
    body: slideBody.replace(/\//g, "\n").trim(),
  }));
}

export type SongPart = {
  start: number;
  end: number;
  category: LineCategory;
  lines: string[];
};

export type Body = {
  tag?: string;
  lines: string[];
};

export enum SlideConvertMethod {
  withFlowOrder,
  withBodyOrder,
}

export type Slide = {
  tag?: string;
  body: string;
};

export class SongParser {
  title?: string;
  flow?: string;
  linkUrl?: string;
  bodys: Body[] = [];
  tagBodyMap = new Map<string, Body>();
  bodysWithNoTag: Body[] = [];
  comments: string[] = [];

  private logDiscard(
    type: string,
    part: SongPart | string[],
    lineJoiner = "\n"
  ) {
    if (part instanceof Array) {
      console.error(`${type} part (${part}) is discarded`);
    } else {
      console.error(
        `${type} part (${part.lines.join(lineJoiner)}) is discarded`
      );
    }
  }

  constructor(public songParts: SongPart[]) {
    let currentTag: string | undefined;
    for (const part of songParts) {
      if (part.category === LineCategory.title) {
        currentTag = undefined;
        if (this.title === undefined) {
          this.title = part.lines.join("\n");
        } else {
          this.logDiscard("title", part);
        }
      }
      if (part.category === LineCategory.flow) {
        currentTag = undefined;
        if (this.flow === undefined) {
          this.flow = part.lines.join(" ");
        } else {
          this.logDiscard("flow", part, " ");
        }
      }
      if (part.category === LineCategory.linkUrl) {
        currentTag = undefined;
        if (this.linkUrl === undefined) {
          this.linkUrl = part.lines.join("\n");
        } else {
          this.logDiscard("linkUrl", part);
        }
      }
      if (part.category === LineCategory.tag) {
        currentTag =
          part.lines[0]
            ?.replace(/^#/, "")
            .replace(/[\][]/g, "")
            .toUpperCase() || undefined;
        console.error("set current tag", currentTag);
        if (part.lines.length > 1) {
          this.logDiscard("tag", part.lines.slice(1), ", ");
        }
      }
      if (part.category === LineCategory.body) {
        console.error("current tag for body", currentTag);
        const lastBody = this.bodys[this.bodys.length - 1];
        if (lastBody && currentTag && lastBody.tag === currentTag) {
          lastBody.lines = lastBody.lines.concat("\n", part.lines);
        } else {
          this.bodys.push({ tag: currentTag, lines: part.lines });
        }
      }
      if (part.category === LineCategory.comment) {
        this.comments.push(part.lines.join("\n"));
      }
    }

    this.bodysWithNoTag = this.bodys.filter(($0) => $0.tag === undefined);
    console.log("bodysWith NoTag", this.bodysWithNoTag);
    this.tagBodyMap = new Map(
      this.bodys
        .flatMap(({ tag, lines }) => (tag ? [{ tag, lines }] : []))
        .map(($0) => [$0.tag, $0])
    );
  }

  toSlideBodyOrder(options: { delimiter: string }): Slide[] {
    const { delimiter } = options;
    return this.bodys.flatMap(($0) => convertBodyToSlide($0, delimiter));
  }

  toSlideFlowOrder(options: { delimiter: string }): Slide[] {
    const { delimiter } = options;
    if (this.flow === undefined) {
      return this.toSlideBodyOrder(options);
    }
    const flowTokens = splitAsTokens(this.flow).map(($0) => $0.toUpperCase());
    const usedTokens = [] as string[];
    const bodys = flowTokens.map((token) => {
      if (token) {
        const taggedBody = this.tagBodyMap.get(token);
        if (taggedBody) {
          usedTokens.push(token);
          return taggedBody;
        }
      }
      return token;
    });
    const slidesFromFlowTokens: Slide[] = bodys.flatMap((body) => {
      if (typeof body === "string") {
        return [{ tag: body, body: "" }];
      } else {
        return convertBodyToSlide(body, delimiter);
      }
    });
    const slidesFromUnusedTaggedBodys = this.bodys
      .filter(($0) => $0.tag && !usedTokens.includes($0.tag))
      .flatMap(($0) => convertBodyToSlide($0, delimiter));
    const slidesFromUntaggedBodys = this.bodysWithNoTag.flatMap(($0) =>
      convertBodyToSlide($0, delimiter)
    );
    return slidesFromFlowTokens
      .concat(slidesFromUnusedTaggedBodys)
      .concat(slidesFromUntaggedBodys);
  }

  toSlides(
    options: {
      method?: SlideConvertMethod;
      delimiter?: string;
    } = {}
  ): Slide[] {
    const {
      method = SlideConvertMethod.withFlowOrder,
      delimiter = "/",
    } = options;
    switch (method) {
      case SlideConvertMethod.withFlowOrder:
        return this.toSlideFlowOrder({ delimiter });
      case SlideConvertMethod.withBodyOrder:
        return this.toSlideBodyOrder({ delimiter });
      default:
        return this.toSlideBodyOrder({ delimiter });
    }
  }

  toString(): string {
    return `
			* title: ${this.title}
			* flow: ${this.flow}
			* linkUrl: ${this.linkUrl}
			* bodys: ${this.bodys
        .map(({ tag, lines }) => `[${tag}]\n${lines.join("\n")}`)
        .join("\n\n")}
			* tagBodyMap: ${this.tagBodyMap}
			* bodysWithNoTag: ${this.bodysWithNoTag}
			* comments: ${this.comments}
		`;
  }
}
