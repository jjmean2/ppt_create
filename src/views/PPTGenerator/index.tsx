import React, { ReactElement, useRef } from "react";
import { Box, Button } from "@material-ui/core";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { FatalError } from "error/FatalError";
import asPage from "views/common/asPage";
import { useCreatePPT } from "./useCreatePPT";
import { getDefaultPPTFilename } from "./util";

const TextArea = styled("textarea")``;

function PPTGenerator(): ReactElement {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { createPPT, hiddenPPTCreateFormElement } = useCreatePPT();

  const handleClickSubmit = (): void => {
    try {
      createPPT({
        filename: getDefaultPPTFilename(),
        lyricText: "",
      });
    } catch (error: unknown) {
      if (error instanceof FatalError) {
        console.error(error);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      <Box>
        <Button onClick={handleClickSubmit}>제출</Button>
      </Box>
      <Box display="flex" flexGrow={1}>
        <TextArea
          ref={textAreaRef}
          sx={{
            flexGrow: 1,
            alignItems: "stretch",
          }}
          placeholder="가사를 입력해주세요"
        />
      </Box>
      {hiddenPPTCreateFormElement}
    </Box>
  );
}

export default asPage(PPTGenerator);
