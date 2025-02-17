import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../middleware/errorHandler';
import { io } from '../index';
import { sendBookingConfirmation } from '../services/emailService';

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spot_id, start_time, end_time, guest_count, event_type } = req.body;

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        spot_id,
        guest_id: req.user.id,
        start_time,
        end_time,
        guest_count,
        event_type,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    // Notify the host via WebSocket
    io.to(spot_id).emit('new-booking', booking);

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, spots(*), profiles(*)')
      .eq('id', id)
      .single();

    if (error) throw new AppError('Booking not found', 404);

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Error updating booking', 400);

    // Notify relevant parties via WebSocket
    io.to(booking.spot_id).emit('booking-updated', booking);

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError('Error cancelling booking', 400);

    // Notify relevant parties via WebSocket
    io.to(booking.spot_id).emit('booking-cancelled', booking);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, spots(*)')
      .eq('guest_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error fetching bookings', 400);

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};