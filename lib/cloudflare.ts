import axios from "axios";

const cloudflare = axios.create({
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run`,
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  },
  timeout: 120000, // 120 seconds
});

export default cloudflare;