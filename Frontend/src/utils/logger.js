const service = 'frienemie-web';

function write(level, event, fields = {}) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service,
    environment: import.meta.env.MODE,
    event,
    ...fields,
  });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
}

function errorFields(error) {
  return {
    errorName: error?.name || 'Error',
    ...(error?.code !== undefined ? { errorCode: String(error.code) } : {}),
  };
}

export function logError(event, error, fields = {}) {
  write('error', event, { ...fields, ...errorFields(error) });
}

export function logInfo(event, fields = {}) {
  write('info', event, fields);
}

export function logWarn(event, error, fields = {}) {
  write('warn', event, { ...fields, ...errorFields(error) });
}

export function logApiFailure(operation, response, durationMs) {
  const level = response.status >= 500 ? 'error' : 'warn';
  write(level, 'api.response.failed', {
    operation,
    statusCode: response.status,
    durationMs,
    ...(response.headers.get('x-request-id') ? { requestId: response.headers.get('x-request-id') } : {}),
  });
}

export async function apiFetch(url, options, operation) {
  const startedAt = performance.now();
  try {
    const response = await fetch(url, options);
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    if (!response.ok) {
      logApiFailure(operation, response, durationMs);
    } else {
      write('info', 'api.request.completed', {
        operation,
        statusCode: response.status,
        durationMs,
        ...(response.headers.get('x-request-id') ? { requestId: response.headers.get('x-request-id') } : {}),
      });
    }
    return response;
  } catch (error) {
    logError('api.network.failed', error, { operation, durationMs: Math.round((performance.now() - startedAt) * 100) / 100 });
    throw error;
  }
}

export function installGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    logError('browser.uncaught_error', event.error, { sourceType: 'window' });
  });
  window.addEventListener('unhandledrejection', (event) => {
    logError('browser.unhandled_rejection', event.reason, { sourceType: 'promise' });
  });
}
