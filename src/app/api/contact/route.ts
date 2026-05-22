import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sanitization helper to strip HTML tags
const stripHtml = (str: string) => str.replace(/<[^>]*>?/gm, '');

// Zod schema for input validation and transformation
const contactSchema = z.object({
  name: z.string().min(2).max(80).transform(stripHtml),
  email: z.string().email().toLowerCase(),
  message: z.string().min(10).max(500).transform(stripHtml),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input data." }, { status: 400 });
    }

    const { name, email, message } = result.data;

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["aziztebbeng@gmail.com"],
      replyTo: email,
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
