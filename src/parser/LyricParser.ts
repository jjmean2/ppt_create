import { LineParser } from "./LineParser";
import { Slide, SlideConvertMethod, SongParser } from "./SongParser";

function convertSlideToFormText(slide: Slide): string {
  const { tag, body } = slide;
  return [`[[${tag ?? ""}]]`, body || tag].join("\n");
}
function convertSongSlidesToFormText(slides: Slide[]): string {
  return slides.map(convertSlideToFormText).join("\n---\n");
}

export class LyricParser {
  lineParser: LineParser;
  songParsers: SongParser[];
  constructor(text: string) {
    this.lineParser = new LineParser(text);
    this.songParsers = this.lineParser.songs();
  }

  toFormText(
    options: {
      method?: SlideConvertMethod;
      delimiter?: string;
    } = {}
  ): string {
    return this.songParsers
      .map(($0) => {
        return convertSongSlidesToFormText($0.toSlides(options));
      })
      .join("\n===\n");
  }
}
