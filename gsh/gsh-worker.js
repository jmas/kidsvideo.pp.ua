onmessage = (event) => {
  const [fnSource, fnArgs, fnArgsValues] = event.data;
  const fn = new Function(...fnArgs, fnSource);
  postMessage(fn(...fnArgsValues));
};
