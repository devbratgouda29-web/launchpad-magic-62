import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Global middleware for error handling/reporting.
const errorMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    try {
      return await next();
    } catch (err) {
      console.error("Server function error:", err);
      throw err;
    }
  },
);

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => {
  return {
    functionMiddleware: [attachSupabaseAuth],
    requestMiddleware: [errorMiddleware, csrfMiddleware],
  };
});
