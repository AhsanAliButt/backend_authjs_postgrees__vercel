import { NextResponse } from "next/server";
import { Resend } from "resend";
import MagicLinkEmail from "../../../../react-email-starter/emails/notion-magic-link";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, firstName, loginLink } = await req.json(); // Get 'to' and 'firstName' from request body

    const resend = new Resend(process.env.RESEND_API_KEY);

    // const domain = await resend.domains.create({ name: "ahsanali@matrix.com" });
    // if (domain) {
    //   return NextResponse.json(domain);
    // }
    const { data, error } = await resend.emails.send({
      from: `Acme <${process.env.EMAIL_FROM}>`,
      to: [to], // `to` must be in an array
      subject: "Verify Your Account",
      react: MagicLinkEmail({ name: firstName, loginLink }), // Pass the firstName to your EmailTemplate
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return {
      message: `Verification Otp Email sent to ${to}. Please check now. OTP expires in 1 hour`,
      status: 200,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
