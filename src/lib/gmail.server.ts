const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);
const clean = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function sendGmail(opts: { to: string; subject: string; body: string; replyTo?: string }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!gmailKey) throw new Error("GOOGLE_MAIL_API_KEY is not configured");

  const lines = [
    `To: ${clean(opts.to)}`,
    ...(opts.replyTo ? [`Reply-To: ${clean(opts.replyTo)}`] : []),
    `Subject: ${header(clean(opts.subject))}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(opts.body),
  ];
  const raw = b64(lines.join("\r\n")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gmail send failed [${res.status}]: ${text}`);
  }
}
