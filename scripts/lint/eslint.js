'use strict';

const { join } = require('path');
const { spawn } = require('child_process');
const extension = process.platform === 'win32' ? '.cmd' : '';

spawn(
  join('node_modules', '.bin', 'eslint' + extension),
  ['.', '--max-warnings=0', '--fix=true'],
  {
    stdio: 'inherit',
  },
).on('close', code => {
  if (code !== 0) {
    console.error('lint failed');
  } else {
    console.log('lint passed');
  }

  process.exit(code);
});
