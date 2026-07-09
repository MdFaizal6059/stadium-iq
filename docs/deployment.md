# Deployment — Cloud Run & self-hosted

## 1. Prerequisites

- Google Cloud project with billing enabled
- API keys for `GEMINI_API_KEY`, `SEARCH_API_KEY`, `AIMODE_API_KEY`,
  `LOCAL_API_KEY`, `MAPS_API_KEY`
- `gcloud`, `docker`, `bun` installed locally

## 2. Build the image

```bash
docker build -t worldcupiq-ai:latest .
```

## 3. Push to Artifact Registry

```bash
PROJECT=your-gcp-project
REGION=us-central1
REPO=worldcupiq
gcloud artifacts repositories create $REPO --repository-format=docker --location=$REGION || true
docker tag worldcupiq-ai:latest $REGION-docker.pkg.dev/$PROJECT/$REPO/worldcupiq-ai:latest
docker push $REGION-docker.pkg.dev/$PROJECT/$REPO/worldcupiq-ai:latest
```

## 4. Deploy to Cloud Run

```bash
gcloud run deploy worldcupiq-ai \
  --image $REGION-docker.pkg.dev/$PROJECT/$REPO/worldcupiq-ai:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars=GEMINI_API_KEY=...,SEARCH_API_KEY=...,AIMODE_API_KEY=...,LOCAL_API_KEY=...,MAPS_API_KEY=...
```

## 5. Verify

```bash
curl -s https://<service-url>/api/health | jq .
```

Expected: `status: ok` and all five `apis.*` flags true.

## 6. Rollback

```bash
gcloud run services update-traffic worldcupiq-ai --to-revisions=REVISION=100
```