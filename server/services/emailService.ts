import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

export const sendBookingConfirmation = async (
  email: string,
  bookingDetails: any
) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Booking Confirmation - appiSpot',
      templateId: 'd-your-template-id', // Create a template in SendGrid
      dynamicTemplateData: {
        booking: bookingDetails,
      },
    };

    await sgMail.send(msg);
    logger.info(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

export const sendBookingReminder = async (
  email: string,
  bookingDetails: any
) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Upcoming Booking Reminder - appiSpot',
      templateId: 'd-your-template-id', // Create a template in SendGrid
      dynamicTemplateData: {
        booking: bookingDetails,
      },
    };

    await sgMail.send(msg);
    logger.info(`Booking reminder email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending booking reminder email:', error);
    throw error;
  }
};