// bungieService.js
import fetch from "node-fetch";

const API_KEY = process.env.BUNGIE_API_KEY; // keep secrets out of source code
const CLIENT_ID = process.env.BUNGIE_CLIENT_ID;
const CLIENT_SECRET = process.env.BUNGIE_CLIENT_SECRET;
const REDIRECT_URI = process.env.BUNGIE_REDIRECT_URI;

export const bungieService = {
  getManifest: async () => {
    const res = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
      headers: { "X-API-Key": API_KEY },
    });
    return res.json();
  },

  exchangeCodeForToken: async (code) => {
    const res = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });
    return res.json(); // returns access_token and other info
  },

  getCharacterStats: async ({ membershipType, membershipId, characterId, accessToken }) => {
    const res = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/`,
      {
        headers: {
          "X-API-Key": API_KEY,
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    return res.json();
  },
};