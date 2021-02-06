import React, { useRef } from "react";
import "./App.css";
import CSRFToken from "./api/CSRFToken";
import { LyricParser } from "./parser/LyricParser";

const actionUrl = "http://jjmean2.pythonanywhere.com/ppt_create/lyrics";
function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenBodyRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = (): void => {
    if (!formRef.current || !textAreaRef.current || !hiddenBodyRef.current) {
      return;
    }
    const value = textAreaRef.current?.value;
    if (!value) {
      return;
    }
    const parser = new LyricParser(value);
    const formText = parser.toFormText();
    hiddenBodyRef.current.value = formText;
    formRef.current.submit();
  };
  return (
    <div className="App">
      <form
        id="lyrics_form"
        name="lyrics_form"
        ref={formRef}
        method="post"
        action={actionUrl}
      >
        <CSRFToken />
        <input ref={hiddenBodyRef} type="hidden" name="body"></input>
      </form>
      <div>
        <textarea
          className="form-control"
          ref={textAreaRef}
          id="lyrics"
        ></textarea>
        <div>
          <button className="btn btn-primary" onClick={handleButtonClick}>
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
