export const WP_API_URL = process.env.WP_API_URL;

if (!WP_API_URL) {
  throw new Error("WP_API_URL is not defined");
}
