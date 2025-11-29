import emailjs from "@emailjs/browser";

export function sendEmailHandler(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;

  return emailjs.sendForm(
    "service_7x03otp",
    "template_7l9tefg",
    form,
    "CKOPi4XGC27LBfg6Q"
  );
}
