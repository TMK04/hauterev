export const get = (input: RequestInfo) => fetch(input).then((res) => res.json());
