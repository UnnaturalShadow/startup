// getMembershipId.js
import fetch from "node-fetch";
import 'dotenv/config';

const API_KEY = process.env.VITE_BUNGIE_API_KEY || process.env.BUNGIE_API_KEY;
const USERNAME = "UnnaturalShadow"; // no # tag
const TYPES_TO_TRY = [1, 3, 254]; // PSN, Xbox, Bungie.net account

async function main() {
  for (const type of TYPES_TO_TRY) {
    try {
      const res = await fetch(
        `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${type}/${USERNAME}/`,
        { headers: { "X-API-Key": API_KEY } }
      );

      if (!res.ok) {
        console.warn(`Type ${type} failed: ${res.status} ${res.statusText}`);
        continue;
      }

      const data = await res.json();
      if (data.Response?.length > 0) {
        const player = data.Response[0];
        console.log("✅ Found player!");
        console.log("Membership ID:", player.membershipId);
        console.log("Membership Type:", player.membershipType);
        console.log("Display Name:", player.displayName);
        return;
      } else {
        console.warn(`Type ${type} returned empty response`);
      }
    } catch (err) {
      console.error(`Error trying type ${type}:`, err);
    }
  }

  console.error("Player not found with any membership type.");
}

main();