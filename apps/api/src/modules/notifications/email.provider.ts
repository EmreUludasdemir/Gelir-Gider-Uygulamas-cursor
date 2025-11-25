export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<void>;
}

export class ConsoleEmailProvider implements EmailProvider {
  // Basit demo: gerçek dünyada burada SendGrid/Mailgun SDK çağrısı olur
  async send(payload: EmailPayload): Promise<void> {
    // eslint-disable-next-line no-console
    console.log("[EMAIL]", payload.to, payload.subject);
  }
}


