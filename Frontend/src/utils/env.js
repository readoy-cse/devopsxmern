// Dev server: read from .env via Vite's import.meta.env.
// Production build: read from window.RUNTIME_CONFIG, injected into
// config.js at container startup from the runtime environment (see
// docker-entrypoint.sh), so the same image can be deployed to any
// VM/Docker/Kubernetes environment without rebuilding.
export const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL
  : window.RUNTIME_CONFIG?.VITE_API_URL;
