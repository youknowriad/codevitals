
# CodeVitals

Follow the performance metrics of your codebase.

## Setup

To run the application locally, you need a planetscale database setup and a `.env.local` file with the following variables:

```bash
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=random
DATABASE_URL=mysql://<USERNAME>:<PLAIN_TEXT_PASSWORD>@<ACCESS_HOST_URL>/<DATABASE_NAME>?ssl={"rejectUnauthorized":true}
```

## Logging Performance Metrics

CodeVitals provides an API endpoint to log performance metrics from your CI/CD pipeline or local development.

### API Endpoint

```
POST /api/log?token=<PROJECT_TOKEN>
```

### Request Body

```json
{
  "hash": "abc123",
  "branch": "main",
  "timestamp": "2026-01-17T10:00:00.000Z",
  "baseHash": "xyz789",
  "baseMetrics": {
    "bundleSize": 150000,
    "buildTime": 5000
  },
  "metrics": {
    "bundleSize": 155000,
    "buildTime": 5200
  }
}
```

### Parameters

- **token** (query): Your project's API token (found in project settings)
- **hash**: Git commit hash for the current build
- **branch**: Git branch name
- **timestamp**: ISO 8601 timestamp of when metrics were measured
- **baseHash**: Git commit hash of the baseline for normalization
- **baseMetrics**: Metric values from the baseline commit
- **metrics**: Current metric values to log

### Normalization

CodeVitals normalizes metrics against a baseline commit to show relative changes over time rather than absolute values. This makes performance trends more visible and comparable across different metrics.

#### How It Works

When you log metrics, you provide both:
- **Current metrics** for the commit you're measuring
- **Base metrics** from a reference commit (typically your first commit or a stable release)

The first time base metrics are logged for a commit, they're stored as-is. For subsequent measurements, CodeVitals calculates normalized values using:

```
normalized_value = (current_value × baseline_stored_value) / baseline_current_value
```

#### Example

Let's say your first commit had a build time of 5000ms on your CI server (baseline). This gets stored with a normalized value of 5000.

Later commits measure against this baseline:
- Commit 2: 5200ms build time → normalized to `(5200 × 5000) / 5000 = 5200`
- Commit 3: 5400ms build time → normalized to `(5400 × 5000) / 5000 = 5400`

Now your CI provider upgrades their hardware, and suddenly the baseline commit measures at 4000ms:
- Commit 4: 4300ms build time → normalized to `(4300 × 5000) / 4000 = 5375`

Without normalization, your chart would show a sudden 20% improvement at commit 4 due to the hardware upgrade. With normalization, the chart correctly shows that commit 4 is actually 7.5% slower than the baseline in relative terms.

This normalization ensures that:
- Charts show relative performance changes, not fluctuations due to environment changes
- You can compare metrics over time even if your infrastructure or test environment changes
- Percentage changes remain accurate and meaningful

### CURL Example

```bash
curl -X POST "https://your-domain.com/api/log?token=YOUR_PROJECT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hash": "a1b2c3d4",
    "branch": "main",
    "timestamp": "2026-01-17T10:30:00.000Z",
    "baseHash": "x9y8z7w6",
    "baseMetrics": {
      "bundleSize": 150000,
      "buildTime": 5000
    },
    "metrics": {
      "bundleSize": 155000,
      "buildTime": 5200
    }
  }'
```

### GitHub Actions Example

```yaml
- name: Log metrics to CodeVitals
  run: |
    curl -X POST "https://your-domain.com/api/log?token=${{ secrets.CODEVITALS_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d "{
        \"hash\": \"$GITHUB_SHA\",
        \"branch\": \"$GITHUB_REF_NAME\",
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
        \"baseHash\": \"$BASE_COMMIT\",
        \"baseMetrics\": $BASE_METRICS,
        \"metrics\": $CURRENT_METRICS
      }"
```
