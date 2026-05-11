"use client";

import { useEffect, useState, FormEvent } from "react";

const PASSWORD = "patriotic";
const STORAGE_KEY = "great-american-story-auth";

export default function GreatAmericanStoryPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pwInput.trim().toLowerCase() === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput("");
    }
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0D0C0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "320px", textAlign: "center" }}
        >
          {/* Subtle red/white/blue accent — USA special */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <div style={{ width: "14px", height: "3px", background: "#B23A48" }} />
            <div style={{ width: "14px", height: "3px", background: "#F0EDE6" }} />
            <div style={{ width: "14px", height: "3px", background: "#3A6BA5" }} />
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#C5A455",
              marginBottom: "20px",
            }}
          >
            Enter Password
          </div>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => {
              setPwInput(e.target.value);
              setPwError(false);
            }}
            autoFocus
            placeholder="Password"
            className="font-mono"
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#0D0C0A",
              border: `1px solid ${pwError ? "#E03A3A" : "#C5A455"}`,
              color: "#F0EDE6",
              fontSize: "14px",
              letterSpacing: "1px",
              outline: "none",
              borderRadius: "2px",
            }}
          />
          {pwError && (
            <div
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#E03A3A",
                marginTop: "12px",
              }}
            >
              Incorrect
            </div>
          )}
          <button
            type="submit"
            className="font-mono"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "14px",
              background: "#C5A455",
              color: "#0D0C0A",
              border: "none",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Placeholder until assets arrive
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#F0EDE6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      {/* Subtle red/white/blue accent */}
      <div style={{ display: "flex" }}>
        <div style={{ width: "14px", height: "3px", background: "#B23A48" }} />
        <div style={{ width: "14px", height: "3px", background: "#F0EDE6" }} />
        <div style={{ width: "14px", height: "3px", background: "#3A6BA5" }} />
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: "14px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#666",
        }}
      >
        temp
      </div>
    </div>
  );
}
