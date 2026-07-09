# Google Colab guide

A Colab-friendly walkthrough for evaluators who want to inspect the
decision engine without a full Cloud Run deploy.

```python
# 1. Install
!pip install requests

# 2. Configure keys (challenge-required names)
import os
os.environ["GEMINI_API_KEY"] = "sk-..."

# 3. Call the decision engine (once the app is deployed)
import requests
r = requests.post(
    "https://<service-url>/api/decision",
    json={
        "query": "Gate E crowd density approaching threshold at kickoff-30",
        "persona": "operations"
    }
)
r.json()
```

Notes:
- The Colab demo assumes you have deployed to Cloud Run.
- For local RAG experimentation, upload PDF/CSV/TXT via the app's Settings
  page and use the Command Center to query.