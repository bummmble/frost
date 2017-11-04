import PrettyError from 'pretty-error';

const pretty = new PrettyError();

pretty.skipNodeFiles();
pretty.skipPackage('express');

export default server => {
  server.use((err, req, res, next) => {
    console.log(pretty.render(err));
    next();
  });
};
