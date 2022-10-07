export const config = (password) => ({
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: 'radchuk_you@meta.ua',
    pass: password,
  },
});

export const mail = (verificationToken, email) => ({
  to: email,
  from: 'radchuk_you@meta.ua',
  subject: 'verification letter',
  html: `<a target="_blank" href="http://localhost:3333/auth/verify/${verificationToken}">Confirm your registration</a>`,
});
