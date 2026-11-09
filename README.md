# KatalogKu Stage B — PocketBase

Three containers provide two independent PocketBase/SQLite services behind an Nginx API gateway. PocketBase collection schemas are imported automatically at first startup through migrations. Each service has a persistent named volume.

## Architecture and ports

| Container | Responsibility | Host port |
|---|---|---:|
| `product-service` | PocketBase, public product reads, superuser-only writes | 8091 |
| `account-service` | PocketBase users and owner-scoped favorites | 8092 |
| `gateway` | Nginx routes `/api/products`, `/api/auth/...`, `/api/favorites`; health endpoint | 18081 (8080 was unavailable in Docker Desktop) |

Favorites store `product_id` as a string because the product and account databases are separate. A unique database index prevents duplicate `(user, product_id)` favorites.

## Start on Windows with WSL2

From PowerShell in this folder:

```powershell
Copy-Item .env.example .env
# Edit .env; use different long random values for both superuser passwords.
wsl.exe -e bash -lc 'cd "/mnt/e/Repos/TST KatalogKu/TST KatalogKu Pocketbase" && docker compose up -d --build'
wsl.exe -e bash -lc 'cd "/mnt/e/Repos/TST KatalogKu/TST KatalogKu Pocketbase" && docker compose ps'
```

The local deployment uses `.env` for product and account superuser credentials and test-user credentials. `.env` is ignored by Git. The two dashboard superusers are upserted automatically when their containers start. Dashboards are at `http://localhost:8091/_/` and `http://localhost:8092/_/`.

The collection migration reads `POCKETBASE_SCHEMA` and imports the matching JSON from the read-only `/pb_schema` mount. On an existing data volume, the migration only runs if it has not already been applied; normal PocketBase data remains in `product_data` and `account_data`.

## Seed products

Open `seed.http` with the VS Code REST Client extension. Copy `PRODUCT_SUPERUSER_EMAIL` and `PRODUCT_SUPERUSER_PASSWORD` from the local `.env` into the login body, send the login request, and paste its token into `@suToken`. Send each of the five product requests once. Product creation and modification are restricted to PocketBase superusers.

## API checks

Open `api.http` in VS Code and set a test password in its registration and login bodies. Run the health, product list, product detail, registration, and login requests in order. Then run the favorite create, list, and delete requests with the token returned by login. Registration is a one-time operation for each email. Authenticated requests use the PocketBase token in the `Authorization` header.

Postman assets are in `postman/`. Select `KatalogKu - Lokal` for `http://localhost:18081/api`; update the ServerLAN or Cloudflare environment base URL for your own host.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | public |
| GET | `/api/products` and `/api/products/{id}` | public |
| POST | `/api/auth/records` | public registration |
| POST | `/api/auth/auth-with-password` | public login |
| GET, POST | `/api/favorites` | authenticated owner |
| DELETE | `/api/favorites/{id}` | authenticated owner |

## Verify and operate

```bash
docker compose ps
docker compose logs --tail=100 product-service account-service gateway
docker compose stop
```

The database and uploaded files persist in named volumes when containers stop or are recreated. Do not use `docker compose down -v` if the data must be retained.

## Stage B files

The Stage B submission ZIP includes this guide, the Compose file, PocketBase image setup and migrations, gateway config, schemas, HTTP examples, Postman files, `.env.example`, and the short PDF report. It excludes `.env` and live databases.
