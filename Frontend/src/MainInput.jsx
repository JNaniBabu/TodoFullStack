import { useState, useEffect } from "react";
import { fetchWithRefresh } from "./authenticate";

function MainInput({ UpdationOFlist }) {
  const ListDO = [
    "Wake up early",
    "Go for a walk / exercise",
    "Meditation for 10 minutes",
    "Read 10 pages of a book",
    "Practice coding for 1 hour",
    "Work on project tasks",
    "Check and reply to emails",
    "Attend classes / meetings",
    "Plan the day",
    "Complete pending assignments",
    "Drink enough water",
    "Take healthy meals on time",
    "Clean your workspace",
    "Learn something new",
    "Review today’s progress",
    "Prepare tomorrow’s task list",
    "Sleep on time",
    "Call family / friends",
    "Pay bills / manage expenses",
    "Organize files and documents",
  ];
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [activity, setActivity] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQ((prev) => (prev === ListDO.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function handleUpdatation() {
  if (loading) return;

  if (!activity.trim() || !dateTime) {
    setError("All fields are required");
    return;
  }

  const now = new Date();
  const selected = new Date(dateTime);

  if (selected <= now) {
    setError("Date should be in the future");
    return;
  }

  setError("");
  setLoading(true);

  const Data = {
    activity,
    dateTime: `${dateTime}:00`,
    done: false,
  };

  try {
    const res = await fetchWithRefresh("http://127.0.0.1:8000/AddToDo/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to add todo");
    }

    setActivity("");
    setDateTime("");
    await UpdationOFlist();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="childheader">
      <div className="childrenOne">
        <input
          type="text"
          placeholder={ListDO[currentQ]}
          className="MainInput"
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value);
            setError("");
          }}
        />

        <div className="response">
          <input
            type="datetime-local"
            className="DateANDTime"
            value={dateTime}
            onChange={(e) => {
              setDateTime(e.target.value);
              setError("");
            }}
          />

          <button onClick={handleUpdatation} className="Doit" disabled={loading}>{loading ? "Adding..." : "Doit"}</button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default MainInput;
