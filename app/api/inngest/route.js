import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";  // Use correct path
import { helloWorld } from "@/lib/inngest/functions"; // Ensure functions.js path

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
