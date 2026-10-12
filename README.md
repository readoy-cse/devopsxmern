# Frienemie — Project Structure & DevOps Overview

## 1. Purpose

Frienemie is a student assignment tracker. A student signs in through Firebase, manages coursework in a React web app, and the app calls an Express API that stores assignment records in MongoDB.

This document describes the repository and the deployment flow represented by the checked-in configuration. It is an operational overview, not a claim that every manifest is production-ready.

## 2. Architecture at a glance

```text
Developer commit
   ├── Frontend GitLab pipeline ──> build frontend image ──> Harbor ──> update frontend manifest repo
   └── Server GitLab pipeline   ──> build backend image  ──> Harbor ──> update backend manifest repo
                                                                          │
                                                               GitOps/deployment controller*
                                                                          │
Browser ──HTTP:80──> Envoy Gateway ──> frontend-svc ──> Nginx + React SPA
Browser ──HTTP:9090─> Envoy Gateway ──> backend-svc  ──> Express API ──> db-svc ──> MongoDB
```

`*` The repository contains CI jobs that commit changed image tags to a manifest repository. No Argo CD, Flux, or other manifest reconciliation controller configuration is present here, so automated apply/sync should be confirmed in the target cluster.

![Project Architecture](docs/architecture.svg)

## 3. Repository map

| Path | Responsibility | DevOps relevance |
| --- | --- | --- |
| `Frontend/` | React 18 + Vite SPA, Firebase client authentication, assignment and focus UI | `dockerfile` builds static assets and serves them with Nginx; `docker-entrypoint.sh` injects runtime API URL; `.gitlab-ci.yml` builds/pushes image and updates the frontend manifest |
| `Frontend/src/Components/` | Pages, authentication, assignment dashboard, shared navigation | Main frontend feature code |
| `Frontend/src/utils/env.js` | Selects API URL from Vite dev env or runtime `window.RUNTIME_CONFIG` | Same built image can be configured at container startup |
| `Frontend/src/utils/logger.js` | Browser JSON logs and API request timing/request ID capture | Browser console is the current frontend log destination |
| `Frontend/nginx.conf` | SPA fallback routing | Nginx serves `index.html` for client-side routes |
| `Server/` | Express 4 API and Mongoose data access | `dockerfile` builds API image; `.gitlab-ci.yml` builds/pushes image and updates backend manifest |
| `Server/DataBase/router.js` | Assignment API routes | `/route` API surface |
| `Server/DataBase/Controller/` | Assignment CRUD logic | API behavior and data validation |
| `Server/DataBase/Model/assignment.js` | MongoDB assignment schema | Persistent domain data shape |
| `Server/utils/logger.js` | Backend JSON logs | Writes to stdout/stderr for container log collection |
| `Manifest/deployments/` | Kubernetes frontend, backend, MongoDB Deployments | Declares image, replica count, ports and environment config |
| `Manifest/services/` | ClusterIP Services | Internal stable addresses between workloads |
| `Manifest/configmap/env-config.yml` | Runtime API URL, API port and Mongo URI | Non-secret runtime configuration (current Mongo URI is a ConfigMap value) |
| `Manifest/envoy_gatewayapi/` | GatewayClass, Gateway and HTTPRoutes | External HTTP entry points for UI and API |
| `Manifest/storage/pv.yml` | Intended storage manifest location | Currently empty; no PV/PVC or Mongo volume mount is configured here |
| `Frontend/README.md` | Frontend product and local run notes | App-level reference |

## 4. Runtime request and data flow

1. A user loads the SPA through the Gateway listener on port 80 and `frontend-svc`.
2. Nginx serves the React app; its startup script writes `config.js` using `VITE_API_URL` from the container environment.
3. Firebase handles client-side email/Google authentication. The app uses the signed-in Firebase user ID when requesting that user's assignments.
4. The browser calls the API through the Gateway listener on port 9090, routed to `backend-svc` on port 2024.
5. Express routes assignment operations to Mongoose. The API connects to MongoDB using `Backend_URL`/`Url`; in Kubernetes that URL points to `mongodb://db-svc:27017/Frienemie`.
6. MongoDB is exposed internally by `db-svc` on port 27017.

The checked-in manifests define all three Deployments with one replica. They do not show readiness/liveness probes, resource requests/limits, autoscaling, PodDisruptionBudgets, or a MongoDB persistent volume mount.

## 5. CI and image promotion

There are two independent GitLab pipelines: `Frontend/.gitlab-ci.yml` and `Server/.gitlab-ci.yml`. Both define `build` and `update-manifest` stages.

1. GitLab starts Docker-in-Docker and builds an image from the service directory.
2. The image is tagged with `$CI_COMMIT_SHORT_SHA` and pushed to Harbor.
3. The job clones the manifest repository using `Manifest_Token`, replaces the matching image tag, commits, and pushes to `main`.
4. A cluster-side reconciler or a separate deployment step must apply that manifest commit for the running Pods to change. That component is not defined in this repository.

CI variables referenced by the jobs include `HarborRepo`, `HrProject`, `HrUser`, `HrPasswd`, `Manifest_Token`, `Manifest_Repo`, `Gitlab_Email`, and `Gitlab_User`. Store credentials as protected/masked GitLab CI variables; do not commit them to YAML.

## 6. Configuration and observability

- Frontend production API URL comes from `VITE_API_URL` at container startup; development uses Vite's `VITE_API_URL`.
- Backend expects `Port` and `Url`. The Kubernetes ConfigMap maps these to `Backend_PORT` and `Backend_URL`.
- Frontend and backend emit one JSON object per log event. Backend records are available on container stdout/stderr; browser records are in the browser developer console. API request IDs are returned in `X-Request-ID`, allowing browser/API log correlation when the header is readable across CORS.
- No centralized log collector, metrics backend, tracing system, alert rules, or dashboards are configured in this repository.
- The ConfigMap contains the MongoDB connection URI. It currently has no credential, but if credentials are introduced, move the URI to a Kubernetes Secret and reference it from the Deployment.

## 7. Current deployment gaps to resolve

These are directly visible in the checked-in configuration and should be reviewed before relying on automated delivery:

1. **Backend pipeline image build context/tag mismatch:** the backend CI job runs `docker build -t frontend .` and then tags that image as the backend image. It should build from the `Server/` context and use a backend-specific local tag. Verify GitLab's configured project directory before changing the command.
2. **Frontend runtime URL and Gateway mismatch:** `Manifest/configmap/env-config.yml` sets `VITE_API_URL` to `http://192.168.200.189:9090`; verify this address is reachable by browser clients and matches the Envoy Gateway listener address/DNS and API route.
3. **Persistence:** `Manifest/storage/pv.yml` is empty, and the MongoDB Deployment has no PVC mount. MongoDB data may be lost when its Pod is recreated, depending on the cluster's backing storage behavior.
4. **MongoDB lifecycle:** `mongo:4.2` is old and the Deployment has a single replica without persistent storage or backup configuration. Plan a supported version upgrade, data migration, backups, and restore validation.
5. **Secrets and image pulls:** manifests do not define `imagePullSecrets`, nor Kubernetes Secrets for runtime credentials. Confirm the cluster can pull private Harbor images and configure secrets securely where needed.
6. **Operational controls:** add probes, resource requests/limits, rollout strategy, and an explicit namespace/environment overlay before production use.
7. **Manifest handoff:** pipelines push to a separately cloned manifest repository. Confirm repository path/branch, commit permissions, and the mechanism that reconciles those commits into the cluster.

## 8. Suggested release verification checklist

- Confirm each pipeline builds the intended Dockerfile and tags the intended repository/image.
- Confirm pushed image digest and manifest tag agree with the commit SHA.
- Confirm the manifest commit is reconciled to the intended cluster and namespace.
- Check Gateway and HTTPRoute status, DNS/IP, and browser access to both UI and API listeners.
- Check frontend runtime config in the running container and verify an API request returns an `X-Request-ID`.
- Inspect frontend console logs and backend Pod logs; correlate using request ID.
- Verify API readiness and MongoDB connectivity, then exercise a create/read/update/delete workflow.
- Before production, verify persistent MongoDB storage, backup and restore, resource sizing, health probes, and secret handling.

## 9. Useful commands

Run from a machine with kubectl configured for the target cluster:

```sh
kubectl get gateway,httproute
kubectl get deploy,svc,pods
kubectl describe httproute frienemie-api-route
kubectl logs deploy/fri-frontend --follow
kubectl logs deploy/fri-backend --follow
kubectl logs deploy/fri-db --follow
```

Names/namespaces can differ by cluster. For the API, inspect request IDs and structured JSON fields in the backend output. Browser logs remain available in the browser developer console unless a browser telemetry collector is added.
