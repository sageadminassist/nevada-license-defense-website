# Website admin and analytics: setup and how it works

The site has its own private statistics and a leads inbox at **`/admin`**
(for example `https://nevadalicensedefense.com/admin/`). Nothing is sent to Google
or any other company. It runs on Hostinger with PHP and a small SQLite database file.

## Turning it on (one time, on Hostinger)

1. **Check PHP.** hPanel → Websites → Manage → Advanced → **PHP Configuration**.
   - PHP version: 8.1 or newer (8.2 or 8.3 is fine).
   - Tab **PHP Extensions**: make sure **pdo_sqlite** and **sqlite3** are ticked. Save.
2. **Publish the site** (the normal deploy).
3. **Right away, open `/admin/` and create the password.** The "Create the admin
   password" screen appears only while no password exists, so do this immediately
   after publishing. Use at least 12 characters and save it in your password manager.
   An email is sent to info@nevadalicensedefense.com when the password is created.
4. **Send yourself a test** with the Free Consultation form on the site. It should
   arrive by email *and* show up under **Leads inbox** in the admin.
5. In the admin, open **Settings → Do not count my own visits** on each computer and
   phone you use, so your own browsing is left out of the numbers.

The staging address and the real domain are separate websites on Hostinger, so each
has its own password and its own statistics. Repeat steps 1 to 5 for each.

### If `/admin/` says "Storage is not ready"

The page tells you what is missing. Usually it is one of:
- The SQLite extension is off: tick **pdo_sqlite** as in step 1.
- The private folder could not be created automatically: in hPanel → **File Manager**,
  go to the folder that *contains* `public_html`, create a new folder there named
  **`nld-private`**, then reload `/admin/`.

## Resetting a forgotten password

1. hPanel → File Manager → open the **`nld-private`** folder (next to `public_html`).
2. Create a new empty file named **`reset-admin.txt`**.
3. Open `/admin/`. It deletes that file and shows "Create the admin password" again.

Only someone who can sign in to Hostinger can do this.

## Backups

All data is one file: `nld-private/nld.sqlite`. Download it from the File Manager now
and then. Publishing the site never touches this folder. Leads can also be downloaded
as a spreadsheet from **Leads inbox → Download spreadsheet (CSV)**.

## What is recorded

- **Page views**: page, where the visitor came from (search engine, another site, ad
  tags), device type, browser, screen width, language.
- **Actions**: phone number taps, email taps, consultation form opened and sent,
  FAQ assistant opened and each question typed (and whether it was answered),
  site searches, clicks to other sites (MyCase login, sister sites).
- **Leads**: every consultation or appointment form, in full, with private notes
  and a New / Handled status. The email to the office is still sent as before.

Privacy: no cookies; IP addresses are never stored. Visitors are counted with an
anonymous code that changes every day. Browsers sending "Do Not Track" or "Global
Privacy Control" are not counted at all, and known bots are ignored. Because of this
the numbers will be a little lower than Google Analytics would show. Questions typed
into the FAQ assistant and search box are stored as typed, so they can occasionally
contain personal details; old statistics are deleted automatically (Settings → How
long to keep data, 13 months by default).

## For developers

| File | Purpose |
|---|---|
| `public/api/inc/lib.php` | Database, schema, visitor hashing, bot / DNT filters, `nld_record()` |
| `public/api/track.php` | Beacon endpoint (always answers 204) |
| `public/api/contact.php` | Form handler: saves the lead, then emails it |
| `public/admin/index.php` | Front controller: first-run setup, login, lockout, routing |
| `public/admin/inc/core.php` | Sessions, CSRF, date range, layout, SVG charts |
| `public/admin/inc/pages.php` | Every admin screen and form action |
| `src/lib/analytics.ts`, `src/components/marketing/analytics.tsx` | Browser tracker |

- **No secrets live in the repo or in `public/`.** The database, PHP sessions, the
  password hash and the random hashing secret are all in `nld-private/`, one level
  above `public_html` (`dirname(__DIR__, 3)` from `api/inc`). Override with the
  `NLD_PRIVATE_DIR` environment variable.
- Security: `password_hash`, strict same-site HttpOnly session cookie scoped to
  `/admin` (Secure on HTTPS), 2-hour idle timeout, CSRF token + same-origin check on
  every POST, 5 wrong passwords per address (30 overall) per 15 minutes then a
  15-minute pause, strict CSP (no scripts at all in the admin), `noindex` headers,
  `robots.txt` disallow, `inc/` folders denied by `.htaccess` and guarded in PHP.
- PHP is not installed on the Mac. Test with Docker: `bash scripts/php-preview.sh`
  (builds nothing; serves `dist/client` at http://localhost:8097 with PHP 8.2 + Apache,
  private data in a throwaway folder inside the container). Run `bun run build` first.
