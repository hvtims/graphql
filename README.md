# graphql

Front-end dashboard that authenticates against the Zone01 auth proxy and uses
GraphQL to render user profile info, audit stats, and skill charts.

## Features
- Login flow with JWT stored in `localStorage`
- Profile summary (name, login, email, campus, region, XP)
- Audit win/loss statistics with progress visualization
- Skill distribution bar chart rendered with SVG
- Responsive layout + in-page notifications

## Getting started
1. Run a local static server from the repo root so `/xd/script.js` resolves:
   ```bash
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in a browser.
3. Log in with valid Zone01 credentials.

## How it works
- `xd/script.js` boots the app and handles login.
- `xd/getdata.js` runs GraphQL queries:
  - User profile + XP
  - Audit history
  - Skill transactions
- `xd/render.js` builds the UI for profile, audit stats, and the skill chart.
- `xd/utils.js` shows notifications.

## Project structure
- `index.html` HTML shell and root containers
- `styles.css` theme, layout, and animations
- `xd/script.js` auth flow and app bootstrap
- `xd/getdata.js` GraphQL calls and data processing
- `xd/render.js` DOM rendering helpers
- `xd/utils.js` notification helper

## Notes
- The auth endpoint is `https://zone01-auth-proxy.onrender.com/auth`.
- GraphQL data comes from `https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`.
- Logging out clears the stored JWT.
