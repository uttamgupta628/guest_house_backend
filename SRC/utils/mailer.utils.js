import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.gmail,  
                pass: process.env.google_App_password  
            }
        });

        const mailOptions = {
            from: process.env.gmail,
            to, 
            subject, 
            text, 
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export { sendEmail };
