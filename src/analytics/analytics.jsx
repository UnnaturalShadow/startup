import React from "react";
import "./analytics.css";

export function Analytics() {
  const [insult, setInsult] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function handleFetchInsult() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insult");
      if (!res.ok) throw new Error("Failed to fetch insult");
      const data = await res.json();
      setInsult(data.insult);
    } catch (err) {
      console.error(err);
      setError("Could not fetch insult. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="guide-page">
      <h1>Evil Insult Generator</h1>

      <section className="insult-section">
        <button
          className="fetch-button"
          onClick={handleFetchInsult}
          disabled={loading}
        >
          {loading ? "Generating insult..." : "Get Insulted!"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {insult && (
          <div className="insult-display">
            <p>{insult}</p>
          </div>
        )}

        {!insult && !loading && (
          <p className="notes">
            Press the button to receive your personalized evil insult.
          </p>
        )}
      </section>
    </main>
  );
}