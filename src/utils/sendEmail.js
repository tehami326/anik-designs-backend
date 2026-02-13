import { Resend } from "resend";

const sendEmail = async ({ to, subject, html }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing from environment variables");
    }

    return await resend.emails.send({
        from: "Anik Design <onboarding@resend.dev>",
        to,
        subject,
        html
    });
};

export default sendEmail;
