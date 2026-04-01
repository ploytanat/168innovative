# Environment Variables

This project uses mock data during local development and can read live content from WordPress in deployed environments.

## Required

### `NEXT_PUBLIC_USE_MOCK`

Controls whether the frontend forces mock data.

- Local development: set this to `true`
- Vercel production/staging: set this to `false` or leave it unset
- If this is `true`, the app will stay on mock data even in production

```env
NEXT_PUBLIC_USE_MOCK=true
```

## Optional

### `WP_API_URL`

Base URL for the WordPress instance used by the frontend when mock mode is off.

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

### Local development

```env
NEXT_PUBLIC_USE_MOCK=true
WP_API_URL=https://your-wordpress-domain.example
REVALIDATE_SECRET=replace-with-a-long-random-string
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-wordpress-application-password
```

### Vercel deployment

```env
NEXT_PUBLIC_USE_MOCK=false
WP_API_URL=https://your-wordpress-domain.example
REVALIDATE_SECRET=replace-with-a-long-random-string
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-wordpress-application-password
```
