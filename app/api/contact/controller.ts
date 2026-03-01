import { db } from "@/firebase";
import { ContactFormData } from "@/lib/util/types";
import { addDoc, collection } from "firebase/firestore";
import { env } from "process";
import postmark from "postmark";

export const postContact = async (contact: ContactFormData) => {
  try {
    const response = await addDoc(collection(db, "contact"), contact);
    if (response) {
      const postmarkClient = new postmark.ServerClient(
        env.POSTMARK_API_KEY ?? "",
      );

      postmarkClient.sendEmail({
        From: "no-reply@freebites.org",
        To: "freebites7@gmail.com",
        Subject: "New Message Received via FreeBites.org",
        HtmlBody: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>New Feedback</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #ff9529; padding: 32px 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                          🍽️ FreeBites
                        </h1>
                        <p style="margin: 8px 0 0; color: #fff3e0; font-size: 14px;">New Website Message</p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.5;">
                          You've received a new message submitted through the contact form on <strong>FreeBites.org</strong>.
                        </p>

                        <!-- Info Cards -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 16px;">
                              <div style="background-color: #f9fafb; border-left: 4px solid #16a34a; border-radius: 4px; padding: 16px 20px;">
                                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280;">Name</p>
                                <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">${contact.name}</p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 16px;">
                              <div style="background-color: #f9fafb; border-left: 4px solid #16a34a; border-radius: 4px; padding: 16px 20px;">
                                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280;">Email</p>
                                <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500;">
                                  <a href="mailto:${contact.email}" style="color: #16a34a; text-decoration: none;">${contact.email}</a>
                                </p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 16px;">
                              <div style="background-color: #f9fafb; border-left: 4px solid #16a34a; border-radius: 4px; padding: 16px 20px;">
                                <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280;">Message</p>
                                <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">${contact.message}</p>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div style="background-color: #f9fafb; border-left: 4px solid #16a34a; border-radius: 4px; padding: 16px 20px;">
                                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6b7280;">Submitted At</p>
                                <p style="margin: 0; font-size: 14px; color: #6b7280;">${contact.date}</p>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Reply CTA -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                          <tr>
                            <td align="center">
                              <a href="mailto:${contact.email}"
                                style="display: inline-block; background-color: #ff9529; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 6px;">
                                Reply to ${contact.name}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                          This email was automatically generated by FreeBites.org · Do not reply directly to this email
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        ReplyTo: contact.email ?? undefined,
      });
    }
    return response;
  } catch (error) {
    throw new Error("failed to post contact: " + error);
  }
};
