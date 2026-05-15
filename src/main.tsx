import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installChunkReloadHandler } from "./lib/chunkReload";
import { runCacheCleanup } from "./lib/cacheCleanup";
import { installTelemetry } from "./lib/telemetry";
import { installWebVitals } from "./lib/webVitals";
import RootErrorBoundary from "./components/RootErrorBoundary";

installChunkReloadHandler();
installTelemetry();
installWebVitals();
runCacheCleanup();

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
