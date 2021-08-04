export const mail = {
  driver: 'mailtrap',

  drivers: {
    mailtrap: {
      host: 'smtp.mailtrap.io',
      port: 2525,
      ssl: false,
      tls: true,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    },

    ses: {
      maxSendRate: 400,
    },
  },
}
