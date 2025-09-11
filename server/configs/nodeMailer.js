import nodemailer from 'nodemailer'

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({from, to, subject, body}) =>{
    const response = await transporter.sendMail({
        from,
        to,
        subject,
        html: body
    })
    return response
}

export default sendEmail
