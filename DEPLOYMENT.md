# Deploying the NSUK ICT Helpdesk (step by step)

This guide puts the app on the internet for free using two services:

- **Supabase** (cloud) - the database, login system and file storage.
- **Vercel** - hosts the Next.js website.

You need a GitHub account, a Supabase account and a Vercel account. All three are free. Allow about 30-45 minutes.

The `.env` values you use on your laptop (`127.0.0.1:54321` and the long demo keys) only work on your own computer. Online, you get **new** values from Supabase. Part 2 explains where.

---

## Part 1 - Put the code on GitHub

Vercel deploys from GitHub.

1. Create a new **private** repository on https://github.com/new (for example `nsuk-ict-helpdesk`). Do not tick "Add a README".
2. In a terminal, from the project folder:

   ```bash
   cd /home/dash/Dash/Projects/ict-helpdesk
   git status
   ```

3. Make sure `.env` and `.env.local` are **not** going to be uploaded. Open `.gitignore` and check it contains a line like `.env*`. If it does not, add `.env` and `.env.local` to it.
4. Commit and push (replace the URL with yours):

   ```bash
   git add .
   git commit -m "NSUK ICT helpdesk UI and deployment guide"
   git remote add myrepo https://github.com/YOUR-USERNAME/nsuk-ict-helpdesk.git
   git push -u myrepo main
   ```

   If `git remote -v` already shows an `origin` that is the original author's repository, keep using a new remote name like `myrepo` as above, since you cannot push to someone else's repository.

---

## Part 2 - Create the Supabase project and get your keys

### 2.1 Create the project

1. Go to https://supabase.com and sign in.
2. Click **New project**.
3. Fill in:
   - **Name:** `nsuk-helpdesk`
   - **Database password:** click **Generate a password** and **copy it somewhere safe**. You may need it later.
   - **Region:** pick the closest one (for Nigeria, `eu-west` / Europe is usually the nearest).
4. Click **Create new project** and wait 1-2 minutes until it finishes setting up.

### 2.2 Get the three values the app needs

| What the app calls it | Where to find it in Supabase |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project Settings** (gear icon, bottom left) -> **API** (or **Data API**) -> **Project URL**. It looks like `https://abcdxyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Project Settings -> API Keys**. Use the key named **anon** / **public**. It is a long text starting with `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page. Use the key named **service_role** and click **Reveal**. It also starts with `eyJ...` |

Notes:

- On newer Supabase dashboards, the `anon` and `service_role` keys are under a tab called **Legacy API keys**. Use those two. They are the ones this app expects.
- The **service_role** key is powerful. Never put it in code, screenshots or chat. It goes only into Vercel's environment variables (Part 4).

Copy these three values into a notepad for now.

### 2.3 Create the database tables

The project already contains the full database setup in one file. The easiest way to apply it:

1. In Supabase, click **SQL Editor** (left sidebar) -> **New query**.
2. On your computer, open `supabase/migrations/001_initial_schema.sql` in your editor, select all (`Ctrl+A`), and copy (`Ctrl+C`).
3. Paste it into the Supabase query box and click **Run**.
4. Wait for it to finish. You should see "Success". This file is long, so it can take a few seconds.

If you see an error, copy the exact error text and fix it before moving on. A common one is an extension that is not enabled. Go to **Database -> Extensions**, enable it, and run the query again.

Do **not** run `supabase/seed.sql` online. It creates fake test users with the password `Password123`. You will create real accounts instead in Part 5.

### 2.4 Check the storage bucket

1. Click **Storage** in the left sidebar.
2. You should see a bucket called **attachments** (the schema file creates it). If it is missing, click **New bucket**, name it `attachments`, and leave it private.

### 2.5 Tell Supabase your website address (do this after Part 4)

You only know your live address after Vercel deploys. Come back to this step once you have it.

1. **Authentication -> URL Configuration**.
2. **Site URL:** your Vercel address, for example `https://nsuk-ict-helpdesk.vercel.app`.
3. **Redirect URLs:** click **Add URL** and add `https://nsuk-ict-helpdesk.vercel.app/**` (use your own address).
4. Save.

Password-reset emails link back to this address, so it must be correct.

### 2.6 Make signup easy for a student project

By default, Supabase makes every new user click a confirmation link in an email, and the free built-in mailer only sends a few emails per hour.

For a project demo, you can turn confirmation off:

1. **Authentication -> Sign In / Providers** (or **Providers**) -> **Email**.
2. Turn **OFF** "Confirm email".
3. Save.

Now people can sign up and log in immediately.

If you want real emails (password reset, ticket notifications), set up a mail server under **Authentication -> SMTP Settings**. Free options include Brevo, Resend or a Gmail app password. This is optional for a demo.

---

## Part 3 - Make a secret for the cron routes

The app has a `CRON_SECRET` variable that protects its scheduled-job endpoints. It is empty in your local `.env`. Generate a random value:

```bash
openssl rand -hex 32
```

Copy the output. It is a long string of letters and numbers. This is your `CRON_SECRET`.

---

## Part 4 - Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New... -> Project**.
3. Find your `nsuk-ict-helpdesk` repository and click **Import**.
4. **Framework Preset** should say **Next.js**. Leave the build settings as they are.
5. Open the **Environment Variables** section and add these one at a time (name on the left, value on the right):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from step 2.2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon key from step 2.2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from step 2.2 |
   | `CRON_SECRET` | the random string from Part 3 |
   | `NEXT_PUBLIC_APP_URL` | `https://YOUR-PROJECT.vercel.app` (see below) |

   For `NEXT_PUBLIC_APP_URL`: Vercel shows the project name before you deploy. If the name is `nsuk-ict-helpdesk`, the address is usually `https://nsuk-ict-helpdesk.vercel.app`. If you get it wrong, fix it after the first deploy (see "Updating later" below).

6. Click **Deploy** and wait 2-4 minutes.
7. When it finishes, click **Visit**. You should see the NSUK login page.
8. Go back to **step 2.5** and enter the final address in Supabase.

### If the build fails

- Open the failed deployment and read the red error lines in the build log.
- Run `npm run build` on your laptop first. If it fails there, fix it there, commit, push, and Vercel redeploys automatically.

---

## Part 5 - Create your first admin account

Because the database is empty, there are no users yet.

1. Open your live site and click **Sign up**. Register with your real email, a name and a password (8+ characters, with an uppercase letter, a lowercase letter and a number).
2. Make that account an admin. In Supabase go to **SQL Editor -> New query**, paste the following (use your email), and click **Run**:

   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```

3. Log out and log in again. You should now see **Admin Settings** in the top menu.
4. Under **Admin Settings -> Ticket Types** and **Categories**, create the types and categories you want (for example "Network", "Software", "Hardware", "Email / Account").

   Tickets cannot be created until at least one ticket type exists.

5. To make staff members agents: ask them to sign up, then in the admin area go to **Agents & Admins**, or run:

   ```sql
   update profiles set role = 'agent' where email = 'staff@example.com';
   ```

---

## Part 6 - Optional extras

### Scheduled SLA checks
The database file includes a job that calls `/api/cron/sla` every 5 minutes, but it only runs if the **pg_cron** extension is on and two database settings are configured. For a student demo you can skip this. The rest of the app works without it.

### Your own domain
In Vercel: **Project -> Settings -> Domains**, add your domain and follow the DNS instructions. After that, update `NEXT_PUBLIC_APP_URL` in Vercel and the Site URL and Redirect URLs in Supabase to the new domain.

### Updating later
- **Code changes:** `git add . && git commit -m "message" && git push`. Vercel redeploys automatically.
- **Changing an environment variable:** Vercel -> **Project -> Settings -> Environment Variables**, edit it, then go to **Deployments**, open the latest one, click the three dots and choose **Redeploy**. Variables beginning with `NEXT_PUBLIC_` only take effect after a redeploy.
- **Database changes:** run the new SQL in the Supabase **SQL Editor**.

---

## Quick troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Login says "Invalid email or password" | The account does not exist yet (sign up first), or the Supabase URL or keys in Vercel are wrong. Check them and redeploy. |
| Sign up says "check your email" but no email arrives | "Confirm email" is on. Turn it off (step 2.6) or set up SMTP. |
| Password reset link goes to `localhost` | The Supabase Site URL is still the default. Fix it in step 2.5. |
| Pages show errors about missing tables | The schema in step 2.3 did not run fully. Run it again and read any error. |
| You cannot create a ticket | No ticket type exists. Add one in Admin Settings -> Ticket Types. |
| File upload fails | The `attachments` storage bucket is missing (step 2.4). |
| The site works but admin links are missing | Your account is not an admin yet. Run the SQL in Part 5 and log in again. |

---

## Checklist

- [ ] Code pushed to GitHub, `.env` files not included
- [ ] Supabase project created, database password saved
- [ ] URL, anon key and service_role key copied
- [ ] `001_initial_schema.sql` run in the SQL Editor
- [ ] `attachments` bucket exists
- [ ] `CRON_SECRET` generated
- [ ] 5 environment variables added in Vercel and deployed
- [ ] Supabase Site URL and Redirect URL set to the live address
- [ ] "Confirm email" turned off (or SMTP set up)
- [ ] First account signed up and promoted to admin
- [ ] Ticket types and categories created
