onmessage = (event) => {
  const [source, args] = event.data;
  const fn = new Function("args", `return (${source})(...args);`);
  postMessage(fn(args));
};
