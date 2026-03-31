# MariaDB Connection

Project now reads these content groups from MariaDB when `NEXT_PUBLIC_USE_MOCK=false`:

- `hero`
- `company`
- `about`
- `why`
- `categories`
- `products`
- `articles`

Current static sections that are still code-driven:

- home ticker
- home process
- home reviews

## Required Environment Variables

```env
NEXT_PUBLIC_USE_MOCK=false
DB_HOST=localhost
DB_PORT=3306
DB_USER=innova_core
DB_PASSWORD=your_hostatom_db_password
DB_NAME=innova_main
```

## HostAtom Import Order

1. Import [innova_main_hostatom_import_2026-03-31.sql](/C:/Users/User/Desktop/168innovative/exports/innova_main_hostatom_import_2026-03-31.sql) into `innova_main`
2. Set environment variables on the Next.js host
3. Restart the app

## Notes

- `.env.local` in this workspace was not overwritten because the real database password was not provided here.
- Default DB fallback in code now points to `innova_main`.
