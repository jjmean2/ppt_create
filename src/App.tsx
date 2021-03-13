import React, { useRef } from "react";
import "./App.css";
import CSRFToken from "./api/CSRFToken";
import { LyricParser } from "./parser/LyricParser";
import { format, getDay } from "date-fns";
import { addDays } from "date-fns/esm";

const example = `
----------------------------
@title: All to Jesus I Surrender (찬송가 내게있는모든것을) (C)
@flow: V1 C V2 C C

V1
All to Jesus I surrender,
All to Him I freely give

I will ever love and trust Him,
In His presence daily live.

C
I surrender all,
I surrender all.

All to Thee, my blessed Savior,
I surrender all.

V2
All to Jesus I surrender,
Humbly at His feet I bow,

Worldly pleasures all forsaken;
Take me, Jesus, take me now.
---------------------------

다음은 규칙입니다.

* 줄바꿈을 하면 슬라이드 내에서도 줄바꿈이 됩니다.

* 두 줄 이상 띄우면 슬라이드가 구분됩니다.

* 가사 앞에는 파트 태그를 붙일 수 있습니다. (V1, V, C, PC, 등등)

* 아무 단어나 앞에 #을 붙여도 파트 태그로 인식합니다. (#CE, #Ending, 등등)

* 파트 태그가 나오면 그 다음 파트 태그가 나오기 전까지의 가사가 그 파트에 속합니다.

* @flow: 는 각 파트의 순서를 지정하는 줄로 여기서 지정한 파트 순서대로 슬라이드가 배치됩니다.

* @flow: 줄 자체는 PPT에 들어가지 않습니다.

* @title: 줄은 제목을 지정하는 줄로 이 줄이 있으면 새로운 곡의 시작으로 봅니다.

* @title: 줄 자체는 PPT에 들어가지 않습니다.
`;

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
  const periodInputRef = useRef<HTMLInputElement>(null);
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
    if (!formText) {
      alert("PPT로 만들 가사가 없습니다. 내용을 확인해주세요.");
      return;
    }
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
            <details className="option_detail">
              <summary>옵션</summary>
              <div className="row">
                <div className="col-xs-2">
                  <label htmlFor="delimiter">
                    곡 마지막 슬라이드에 마침표 추가
                  </label>
                  <input
                    ref={periodInputRef}
                    id="period"
                    className="form-control"
                    placeholder=""
                    type="checkbox"
                  />
                </div>
              </div>
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
            </details>
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
                placeholder={example}
              ></textarea>
              <div className="verticalLine66" />
              <div className="verticalLine90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
