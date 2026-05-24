import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (import.meta.env.DEV) {
  void import("./lib/supabaseConnectionDebug").then(({ testSupabaseConnection }) => {
    void testSupabaseConnection();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
