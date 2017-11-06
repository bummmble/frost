import chalk from 'chalk';

const infoColor = chalk.rgb(135, 206, 250); //info
const successColor = chalk.rgb(102, 205, 170); //success
const warningColor = chalk.rgb(255, 165, 0); //warning
const dotindex = c => {
  const m = /\.[^.]*$/.exec(c);
  return m ? m.index + 1 : c.length;
};

const Logger = {
  success: msg => successColor(msg),
  info: msg => infoColor(msg),
  warning: msg => warningColor(msg),
  error: msg => chalk.red(msg),
  clearConsole: () => {
    process.stdout.write(
      process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H',
    );
  },
  table: (inputRows, config = {}) => {
    const align = config.align;
    const stringLength = config.stringLength;
    const dotsizes = inputRows.reduce((acc, row) => {
      row.forEach((c, index) => {
        const n = dotindex(c);
        if (!acc[index] || n > acc[index]) {
          acc[index] = n;
        }
      });
      return acc;
    }, []);

    const rows = inputRows.map(row => {
      return row.map((column, index) => {
        const c = String(column);
        if (align[index] === '.') {
          const idx = dotindex(c);
          const size =
            dotsizes[index] + (/\./.test(c) ? 1 : 2) - (stringLength(c) - idx);
          return c + Array(size).join(' ');
        }
        return c;
      });
    });

    const sizes = rows.reduce((acc, row) => {
      row.forEach((c, index) => {
        const n = stringLength(c);
        if (!acc[index] || n > acc[index]) {
          acc[index] = n;
        }
      });
      return acc;
    }, []);

    return rows
      .map(row => {
        return row
          .map((c, index) => {
            const n = sizes[index] - stringLength(c) || 0;
            const s = Array(Math.max(n + 1, 1)).join(' ');
            if (align[index] === 'r' || align[index] === '.') {
              return s + c;
            }
            if (align[index] === 'c') {
              return (
                Array(Math.ceil(n / 2 + 1)).join(' ') +
                c +
                Array(Math.floor(n / 2 + 1)).join(' ')
              );
            }
            return c + s;
          })
          .join(' ')
          .replace(/\s+$/, '');
      })
      .join('\n');
  },
};

export default Logger;
