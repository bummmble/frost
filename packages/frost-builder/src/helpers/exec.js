import { execFileSync } from 'child_process';

export function exec(command, args) {
  const options = {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  };

  return execFileSync(command, args, options);
};
