import React, { useCallback, useRef } from "react";
import CSRFToken from "api/CSRFToken";
import { LyricParser } from "parser/LyricParser";
import { FatalError } from "error/FatalError";

const actionUrl = "https://jjmean2.pythonanywhere.com/ppt_create/lyrics";

export function useCreatePPT(): typeof api {
  const formRef = useRef<HTMLFormElement>(null);
  const inputBodyRef = useRef<HTMLInputElement>(null);
  const inputFilenameRef = useRef<HTMLInputElement>(null);

  const formElement = (
    <form
      id="lyrics_form"
      name="lyrics_form"
      ref={formRef}
      method="post"
      action={actionUrl}
    >
      <CSRFToken />
      <input ref={inputBodyRef} type="hidden" name="body"></input>
      <input ref={inputFilenameRef} type="hidden" name="filename"></input>
    </form>
  );

  const createPPT = useCallback(
    (params: {
      filename: string;
      lyricText: string;
      options?: {
        delimiter?: string;
      };
    }) => {
      if (
        inputBodyRef.current === null ||
        inputFilenameRef.current === null ||
        formRef.current === null
      ) {
        throw new FatalError("formElement가 mount 되지 않았습니다.");
      }
      const { filename, lyricText, options = {} } = params;
      if (!lyricText) {
        throw new Error("PPT로 만들 가사가 없습니다. 내용을 확인해주세요");
      }
      const parser = new LyricParser(lyricText);
      const body = parser.toFormText(options);
      if (!body) {
        throw new Error("PPT로 만들 가사가 없습니다. 내용을 확인해주세요");
      }

      inputBodyRef.current.value = body;
      inputFilenameRef.current.value = filename || "untitled";
      formRef.current.submit();
    },
    []
  );

  const api = {
    createPPT,
    hiddenPPTCreateFormElement: formElement,
  };
  return api;
}
