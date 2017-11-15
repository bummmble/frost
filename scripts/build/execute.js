const fs = require('fs');

const executableMode = 0o111;

module.exports = function execute(options = {}) {
  return {
    name: 'rollup-plugin-execute',
    onwrite: ({ file }) => {
      const { mode } = fs.statSync(file);
      const newMode = mode | executableMode;
      fs.chmodSync(file, newMode);
    },
  };
};
