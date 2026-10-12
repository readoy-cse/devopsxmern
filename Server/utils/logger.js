const service = 'frienemie-api';

function write(level, event, fields = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    service,
    environment: process.env.NODE_ENV || 'development',
    event,
    ...fields,
  };
  const line = JSON.stringify(record);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

function errorDetails(error) {
  return {
    errorName: error?.name || 'Error',
    ...(error?.code !== undefined ? { errorCode: String(error.code) } : {}),
  };
}

module.exports = { write, errorDetails };
