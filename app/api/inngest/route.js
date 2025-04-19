import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";  // Use correct path
import { generateIndustryInsights, helloWorld } from "@/lib/inngest/functions"; // Ensure functions.js path

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateIndustryInsights
  ],
});
