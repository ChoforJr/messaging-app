const configuredApiUrl = process.env.NEXT_PUBLIC_MESSAGING_APP_API_URL?.trim();

if (!configuredApiUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "Set NEXT_PUBLIC_MESSAGING_APP_API_URL to the deployed API origin before building for production.",
  );
}

const apiUrl = configuredApiUrl || "http://localhost:5000";
let parsedApiUrl: URL;

try {
  parsedApiUrl = new URL(apiUrl);
} catch {
  throw new Error(
    "NEXT_PUBLIC_MESSAGING_APP_API_URL must be a valid absolute URL.",
  );
}

if (!["http:", "https:"].includes(parsedApiUrl.protocol)) {
  throw new Error(
    "NEXT_PUBLIC_MESSAGING_APP_API_URL must use the http or https protocol.",
  );
}

if (
  process.env.NODE_ENV === "production" &&
  ["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsedApiUrl.hostname)
) {
  throw new Error(
    "NEXT_PUBLIC_MESSAGING_APP_API_URL must not point to localhost in production.",
  );
}

export const API_URL = apiUrl.replace(/\/+$/, "");
