import nodemailer from 'nodemailer';
import { ApolloError } from 'apollo-server-express';

const sendEmailResolver = {
    Mutation: {
        sendEmail: async (_: any, { to, subject, text }: { to: string, subject: string, text: string }) => {
            console.log('node mailer api key', process.env.NODEMAILER_API_KEY)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'emmanuel.arana.gutierrez@gmail.com',
                    pass: process.env.NODEMAILER_API_KEY,
                }
            });

            const mailOptions = {
                from: 'emmanuel.arana.gutierrez@gmail.com',
                to,
                subject,
                text
            };

            try {
                await transporter.sendMail(mailOptions);
                return true;
            } catch (error) {
                console.error('Error al enviar el correo:', error);
                throw new ApolloError("Failed to send E-mail", "FAILED_TO_SEND")
            }
        }
    }
}

export default sendEmailResolver;