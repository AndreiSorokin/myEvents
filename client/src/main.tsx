import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";

import App from "./App.tsx";
import store from "./redux/store.ts";
import ThemeProvider from "./components/contextAPI/ThemeContext.tsx";

// Function to dynamically load the Google Maps script
const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }`;
  script.async = true;
  document.body.appendChild(script);
};

// Load the Google Maps script
loadGoogleMapsScript();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
