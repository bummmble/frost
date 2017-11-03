const formatRaw = (message, isError) => {
  let lines = message.split('\n');

  if (lines.length > 2 && lines[1] === '') {
    lines.splice(1, 1);
  }
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  lines = lines.filter(line => lines.indexOf(' @ ') !== 0);
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  message = lines.join('\n');
  return message.trim();
};

const formatWebpack = json => {
  const errors = json.errors.map(message => formatWebpack(message, true));
  const warnings = json.warnings.map(message => formatWebpack(message, false));
  return { errors, warnings };
};

export { formatRaw, formatWebpack };
