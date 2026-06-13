const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

interface SendOtpEmailParams {
  email: string;
  passcode: string;
}

export async function sendOtpEmail({ email, passcode }: SendOtpEmailParams) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured");
  }

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      email,
      passcode,
    },
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  const response = await fetch(EMAILJS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("EmailJS error:", errorText);
    throw new Error("Failed to send verification email");
  }
}
