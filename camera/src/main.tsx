import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ★ root → camera-ui に変更 ★
createRoot(document.getElementById("camera-ui")!).render(<App />);
