import { Request, Response } from 'express';
import sendEmail from '../utils/sendEmail';

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req: Request, res: Response) => {
    if (!req.user) {
         res.status(401).json({ message: 'Not authorized' });
         return;
    }

    const { type, message } = req.body;

    if (!message || !type) {
        res.status(400).json({ message: 'Please provide a feedback type and message.' });
        return;
    }

    try {
        // Construct the email content
        const emailContent = `
            <div style="font-family: sans-serif; color: #333;">
                <h2 style="color: #ef4444;">Kairon AI Feedback</h2>
                <p><strong>User:</strong> ${req.user.name} (${req.user.email})</p>
                <p><strong>User ID:</strong> ${req.user._id}</p>
                <hr />
                <p><strong>Type:</strong> <span style="background-color: #e5e7eb; padding: 2px 6px; rounded: 4px;">${type}</span></p>
                <p><strong>Message:</strong></p>
                <blockquote style="background-color: #f3f4f6; padding: 10px; border-left: 4px solid #ef4444;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
            </div>
        `;

        // Send email to the admin (using the same email configured for sending)
        await sendEmail({
            email: process.env.EMAIL_USER || '', 
            subject: `[Feedback] ${type} - ${req.user.name}`,
            message: emailContent
        });

        res.status(200).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        console.error("Feedback Error:", error);
        res.status(500).json({ message: 'Failed to send feedback' });
    }
};