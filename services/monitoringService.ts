import * as Sentry from "@sentry/react";

// Check if we are in production to avoid cluttering Sentry with local dev errors
// const isProduction = import.meta.env.PROD; 

/**
 * Initializes the monitoring service.
 * Call this at the application's entry point (e.g., index.tsx or main.tsx).
 */
export const initMonitoring = () => {
//   if (isProduction) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN, // Ensure this var exists in your .env
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions (lower this in high-traffic)
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when an error occurs.
    });
    console.log("Sentry monitoring initialized.");
//   }
};

/**
 * Logs a specific error to the monitoring service.
 * @param error The error object to log.
 * @param context Additional context for debugging (e.g., user input, component name).
 */
export const logError = (error: Error | unknown, context?: Record<string, any>) => {
//   if (isProduction) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setExtras(context);
      }
      Sentry.captureException(error);
    });
//   }
};

/**
 * Logs a custom event or message.
 * @param message The message to log.
 * @param level The severity level (info, warning, error).
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
//   if (isProduction) {
    Sentry.captureMessage(message, level);
//   }
};