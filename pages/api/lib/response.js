/**
 * Shared API response helpers — used by all route handlers.
 * Keeps success/error shape consistent across the entire API surface.
 */

export const sendSuccess = (res, status, message, data = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  res.status(status).json(payload);
};

export const sendError = (res, status, message) => {
  res.status(status).json({ success: false, message });
};
