import React, { useRef } from "react";
import "./App.css";
import CSRFToken from "./api/CSRFToken";
import { LyricParser } from "./parser/LyricParser";
import { format, getDay } from "date-fns";
import { addDays } from "date-fns/esm";

const actionUrl = "https://jjmean2.pythonanywhere.com/ppt_create/lyrics";
// const actionUrl = "http://localhost:8000/ppt_create/lyrics";

const getFilename = (): string => {
  const today = new Date();
  // 0 is Sunday 6 is Saturday
  const weekday = getDay(today);
  const distanceToSunday = (7 - weekday) % 7;
  const nextSunday = addDays(today, distanceToSunday);
  const sundayText = format(nextSunday, "yyyy-MM-dd");
  return "테힐라 찬양 " + sundayText;
};

function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const delimiterInputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenBodyRef = useRef<HTMLInputElement>(null);
  const filenameRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = (): void => {
    if (
      !formRef.current ||
      !textAreaRef.current ||
      !hiddenBodyRef.current ||
      !filenameRef.current
    ) {
      return;
    }
    const value = textAreaRef.current?.value;
    if (!value) {
      return;
    }
    const parser = new LyricParser(value);
    const formText = parser.toFormText({
      delimiter: delimiterInputRef.current?.value || undefined,
    });
    hiddenBodyRef.current.value = formText;
    filenameRef.current.value =
      filenameInputRef.current?.value || getFilename();
    console.log(formText);
    formRef.current.submit();
  };
  return (
    <div className="wrapper">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="{% url 'lyrics' %}">
            가사 PPT 생성기
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="{% url 'lyrics' %}">
                  가사 생성
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
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
            <input ref={filenameRef} type="hidden" name="filename"></input>
          </form>
          <div className="page">
            <div className="row">
              <div className="col-xs-2">
                <label htmlFor="delimiter">구분자: </label>
                <input
                  ref={delimiterInputRef}
                  id="delimiter"
                  className="form-control"
                  placeholder="/"
                  type="text"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-2">
                <label htmlFor="filename">파일명: </label>
                <input
                  ref={filenameInputRef}
                  id="filename"
                  className="form-control"
                  placeholder={getFilename()}
                  type="text"
                />
              </div>
            </div>
            <br />
            <div className="button-container">
              <button className="btn btn-primary" onClick={handleButtonClick}>
                제출
              </button>
            </div>
            <div className="textAreaContainer">
              <textarea
                className="form-control"
                ref={textAreaRef}
                id="lyrics"
              ></textarea>
              <div className="verticalLine66" />
              <div className="verticalLine90" />
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

export default App;
