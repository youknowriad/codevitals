
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
