export default interface Input extends HTMLElement {
  #id: `input-${string}`;
  readonly input: HTMLFormElement;
}
