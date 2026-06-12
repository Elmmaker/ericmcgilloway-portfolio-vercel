"use client";

import { useEffect, useState, type FormEvent } from "react";

/**
 * Lightweight front-end password gate for a private preview page.
 *
 * NOTE: this is a "keep casual visitors out" lock, not real security — the
 * password lives in the client bundle. Fine for sharing an unreleased concept
 * with a client; swap for a server-side check if true protection is needed.
 *
 * While locked, `children` are never rendered, so the heavy 3D model isn't
 * even fetched until the correct password is entered.
 */
export default function PasswordGate({
  password,
  storageKey,
  children,
}: {
  password: string;
  storageKey: string;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") setUnlocked(true);
    } catch {
      /* sessionStorage unavailable — stay locked */
    }
  }, [storageKey]);

  if (unlocked) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === password.toLowerCase()) {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="sm-gate">
      <form
        className={`sm-gate-card ${error ? "is-error" : ""}`}
        onSubmit={submit}
      >
        <div className="sm-gate-eyebrow">Private Preview</div>
        <h2 className="sm-gate-title">Enter password to view</h2>
        <input
          className="sm-gate-input"
          type="password"
          value={value}
          autoFocus
          placeholder="Password"
          aria-label="Password"
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
        />
        <button type="submit" className="sm-gate-btn">
          Unlock
        </button>
        {error && (
          <div className="sm-gate-err">Incorrect password — try again.</div>
        )}
      </form>

      <style jsx global>{`
        .sm-gate {
          width: 100%;
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            ellipse at 50% 42%,
            #4a1340 0%,
            #1a0a1a 60%,
            #050308 100%
          );
          border: 1px solid #211826;
          border-radius: 4px;
        }
        @media (max-width: 640px) {
          /* Match the vertical viewer frame on phones so unlocking doesn't jump. */
          .sm-gate {
            aspect-ratio: 3 / 4;
          }
        }
        .sm-gate-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: clamp(28px, 5vw, 44px);
          width: min(380px, 86%);
          text-align: center;
        }
        .sm-gate-eyebrow {
          font-family: var(--font-jetbrains), monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #ff3b6b;
        }
        .sm-gate-title {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          font-size: clamp(21px, 3vw, 28px);
          letter-spacing: -0.01em;
          color: #f0ede6;
          margin: 0;
        }
        .sm-gate-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 59, 107, 0.4);
          border-radius: 10px;
          color: #fff;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sm-gate-input:focus {
          border-color: #ff3b6b;
          box-shadow: 0 0 0 3px rgba(255, 59, 107, 0.18);
        }
        .sm-gate-btn {
          width: 100%;
          padding: 12px 14px;
          background: #ff3b6b;
          color: #15060d;
          border: none;
          border-radius: 10px;
          font-family: var(--font-jetbrains), monospace;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .sm-gate-btn:hover {
          background: #ff5680;
        }
        .sm-gate-btn:active {
          transform: translateY(1px);
        }
        .sm-gate-err {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 13px;
          color: #ff6b8a;
        }
        .sm-gate-card.is-error .sm-gate-input {
          border-color: #ff3b6b;
          animation: sm-shake 0.3s ease;
        }
        @keyframes sm-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
          }
        }
      `}</style>
    </div>
  );
}
