export default interface AsyncInit {
  #init: () => Promise<any>;
}
