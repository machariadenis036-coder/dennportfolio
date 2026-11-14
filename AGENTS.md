<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Portfolio content (profile, skills, projects) lives in the database and is edited from `/admin`; components only render it — keeps the site editable without code changes.
- Public data is loaded via `getPortfolio` server fn with a publishable client; admin writes use the browser client under RLS (`has_role(..., 'admin')`) — no service-role usage needed.
- Admin role is granted by a trigger on `auth.users` only to the owner's email once confirmed — never grant roles from the client.
- Contact form: `sendContactMessage` saves to `messages` then emails the owner via the Gmail connector (`src/lib/gmail.server.ts`); email failure must not lose the saved message.
- WhatsApp is click-to-chat only (`whatsappLink` in `src/lib/contact.ts`), no WhatsApp API.
