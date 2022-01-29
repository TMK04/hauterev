export const get = (input: RequestInfo) => fetch(input).then((res) => res.json());

export const btn = () => {
  const btn = document.createElement("button");
  btn.classList.add("btn");
  return btn;
};

export const center_content_classes = ["justify-content-center", "align-items-center"];
