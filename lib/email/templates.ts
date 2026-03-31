/**
 * Email Templates
 * 
 * Purpose: Reusable email template components
 * These templates use React-like syntax but compile to HTML
 */

/**
 * Base email wrapper with consistent styling
 */
export function emailWrapper(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unautomatable</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #eee; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                    © ${new Date().getFullYear()} Unautomatable. All rights reserved.<br>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #666; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Button component
 */
export function emailButton(text: string, href: string): string {
  return `
    <a href="${href}" style="
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    ">${text}</a>
  `;
}

/**
 * Header component
 */
export function emailHeader(title: string): string {
  return `
    <h1 style="
      margin: 0 0 20px 0;
      font-size: 28px;
      font-weight: 700;
      color: #000000;
      line-height: 1.3;
    ">${title}</h1>
  `;
}

/**
 * Paragraph component
 */
export function emailParagraph(text: string): string {
  return `
    <p style="
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    ">${text}</p>
  `;
}

/**
 * Divider component
 */
export function emailDivider(): string {
  return `
    <hr style="
      margin: 32px 0;
      border: none;
      border-top: 1px solid #eeeeee;
    ">
  `;
}

/**
 * Alert/Notice component
 */
export function emailAlert(text: string, type: 'info' | 'warning' | 'success' = 'info'): string {
  const colors = {
    info: { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
    warning: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
    success: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
  };

  const color = colors[type];

  return `
    <div style="
      background-color: ${color.bg};
      border-left: 4px solid ${color.border};
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    ">
      <p style="margin: 0; color: ${color.text}; font-size: 14px; line-height: 1.5;">
        ${text}
      </p>
    </div>
  `;
}

/**
 * List component
 */
export function emailList(items: string[]): string {
  const listItems = items.map(item => `
    <li style="margin-bottom: 8px; color: #333;">
      ${item}
    </li>
  `).join('');

  return `
    <ul style="
      margin: 16px 0;
      padding-left: 24px;
      line-height: 1.6;
    ">
      ${listItems}
    </ul>
  `;
}

/**
 * Highlighted stat/metric component
 */
export function emailStat(label: string, value: string): string {
  return `
    <div style="
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    ">
      <div style="font-size: 36px; font-weight: 700; color: #000; margin-bottom: 8px;">
        ${value}
      </div>
      <div style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
        ${label}
      </div>
    </div>
  `;
}

/**
 * Example usage:
 * 
 * const emailHtml = emailWrapper(
 *   emailHeader('Welcome to Unautomatable!') +
 *   emailParagraph('Thanks for joining us...') +
 *   emailButton('Get Started', 'https://app.com/start') +
 *   emailDivider() +
 *   emailList(['Feature 1', 'Feature 2', 'Feature 3'])
 * );
 */
