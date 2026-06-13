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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edu-bridge.up.railway.app";

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured");
  }

  const templateParams = {
    email,
    passcode,
    otp_code: passcode,
    verification_code: passcode,
    code: passcode,
    to_email: email,
    user_email: email,
    reply_to: email,
    from_name: "EduBridge",
    subject: "EduBridge Verification Code",
    message: `Your EduBridge verification code is: ${passcode}`,
  };

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  const response = await fetch(EMAILJS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: appUrl,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("EmailJS error:", response.status, errorText);
    throw new Error(`Failed to send verification email (${response.status})`);
  }
}
