export async function fetchPlayerAnalytics(username) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        profile: {
          name: username,
          lightLevel: 1825,
          class: "Warlock",
          lastLogin: "2026-02-20",
        },
        activities: [
          {
            id: 1,
            name: "Vault of Glass",
            date: "2026-02-18",
            duration: "45m",
            kills: 132,
            deaths: 8,
            score: 250000,
            completed: true,
          },
          {
            id: 2,
            name: "King's Fall",
            date: "2026-02-15",
            duration: "1h 12m",
            kills: 210,
            deaths: 15,
            score: 400000,
            completed: false,
          },
        ],
      });
    }, 500);
  });
}