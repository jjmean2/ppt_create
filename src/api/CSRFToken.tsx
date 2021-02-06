import React, { ReactElement } from "react";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function getCookie(name: string): string | null {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].replace(" ", "");
      //var cookie = jQuery.trim(cookies[i]); 당신이 만약 jQuery를 사용한다면, 위 코드 대신 이 코드를 사용하여도 좋다
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
function CSRFToken(): ReactElement {
  const csrftoken = getCookie("csrftoken");
  return (
    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken ?? ""} />
  );
}

export default CSRFToken;
