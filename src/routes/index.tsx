import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignSafe — Emergency ASL Signs Everyone Should Know" },
      { name: "description", content: "Learn 10 critical emergency ASL signs in under 10 minutes. Built for everyday people who want to be ready when it matters." },
      { property: "og:title", content: "SignSafe — Emergency ASL Signs" },
      { property: "og:description", content: "Learn 10 life-saving ASL signs in under 10 minutes." },
    ],
  }),
  component: Home,
});
