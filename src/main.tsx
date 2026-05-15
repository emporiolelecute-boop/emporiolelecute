import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installChunkReloadHandler } from "./lib/chunkReload";
import { runCacheCleanup } from "./lib/cacheCleanup";

installChunkReloadHandler();
runCacheCleanup();

createRoot(document.getElementById("root")!).render(<App />);
