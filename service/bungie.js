import fetch from "node-fetch";

const API_KEY = process.env.VITE_BUNGIE_API_KEY;

export const bungieService = {
  getAccount: async (membershipType, membershipId) => {
    const res = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`, {
      headers: { "X-API-Key": process.env.BUNGIE_API_KEY }
    });
    return res.json();
  },
  getCharacterActivities: async ({ membershipType, membershipId, characterId }) => {
    const res = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/`, {
      headers: { "X-API-Key": process.env.BUNGIE_API_KEY }
    });
    return res.json();
  }
};