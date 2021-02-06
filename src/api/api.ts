import axios from "axios";

const url = "http://jjmean2.pythonanywhere.com/ppt_create/lyrics";
export function createPPT(value: string) {
  const form = new FormData();
  form.append("body", value);
  axios
    .post(url, form)
    .then((response) =>
      console.log("response", JSON.stringify(response, null, 2))
    )
    .catch((error) => console.log("failed", error));
}
