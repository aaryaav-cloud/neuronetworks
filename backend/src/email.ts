import { config } from './config.js';

// Sends the password-reset email through Resend's HTTP API.
// Without RESEND_API_KEY (local development) it prints the link instead.
export async function sendResetEmail(to: string, name: string, link: string): Promise<void> {
  if (!config.resendApiKey) {
    console.log(`\n[dev] Password reset link for ${to}:\n${link}\n`);
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #17313B; max-width: 480px">
      <p>Hi ${escapeHtml(name)},</p>
      <p>We got a request to reset your NeuroNetworks password. Tap the button to choose a new one.</p>
      <p><a href="${link}" style="display: inline-block; padding: 14px 22px; background: #17313B; color: #FFFFFF; border-radius: 12px; text-decoration: none; font-weight: bold">Choose a new password</a></p>
      <p>This link works for 30 minutes. If you didn't ask for this, you can ignore this email and your password stays the same.</p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: [to],
      subject: 'Reset your NeuroNetworks password',
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
