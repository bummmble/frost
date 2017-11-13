const TEST = false;
if (TEST) {
  console.log('remove me in prod');
}

if ('node' === 'web') {
  console.log('Remove this because being statically false!');
}
