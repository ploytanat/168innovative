# Environment Variables

This project runs on mock data and no longer connects to MariaDB.

## Required

### `NEXT_PUBLIC_USE_MOCK`

Keep this set to `true` in local and deployed environments.

```env
NEXT_PUBLIC_USE_MOCK=true
```

## Optional

### `WP_API_URL`

Base URL for WordPress-related server routes and legacy integrations.

```env
WP_API_URL=https://your-wordpress-domain.example
```

### `REVALIDATE_SECRET`

Secret for the revalidation webhook route.

```env
REVALIDATE_SECRET=replace-with-a-long-random-string
```

### `WP_USERNAME`

WordPress username for server-side write routes.

### `WP_APP_PASSWORD`

WordPress application password paired with `WP_USERNAME`.

## Recommended Setup

```env
NEXT_PUBLIC_USE_MOCK=true
WP_API_URL=https://your-wordpress-domain.example
REVALIDATE_SECRET=replace-with-a-long-random-string
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-wordpress-application-password
```
