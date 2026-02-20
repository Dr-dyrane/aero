---
description: Plan to gamify Aero Score and pivot towards bio-investment trend
---

# 🚀 Mission: The Aero Pivot (Global Bio-Investment)

We are shifting the user psychology from "managing addiction" to **"building a high-yield bio-asset"**. The Aero Score is no longer just a health metric; it is a **status symbol** and a **currency generator**.

## 1. The Dashboard: "The Terminal"

**Goal:** Make the Aero Score feel like a live stock ticker for the user's biological value.

*   **Typography Overhaul:**
    *   Replace the standard score display with the **Welcome Page Aesthetic**: `font-space-grotesk`, `font-light`, `tracking-tighter`, massive size.
    *   Label it "Bio-Market Value" or "Current Equity" metaphorically (even if preserving the name "Aero Score").
*   **"Global Trend" Indicator:**
    *   Add a "Global Percentile" pill: *"Top 4% of Bio-Investors"*.
    *   Show a "Trend Line" vs "Global Average" to induce competitiveness.
*   **Action = Investment:**
    *   Rename "Start Triple-Check" to **"Verify & Mine"** or **"Mint Daily Yield"**. (Let's stick to "Verify Bio-State" but frame the *result* as minting).

## 2. The Vault: "The Endowment"

**Goal:** Shift from "Savings Account" to "Locked Crypto/Asset Protocol".

*   **Visual Purity:**
    *   Use a **"Frozen Glass"** card for the Locked Balance (representing the endowment).
    *   Use a **"Liquid Gold"** card for the Spendable Balance (representing liquidity).
*   **The Hook:**
    *   Add a progress bar: *"Earnings potential: $340/mo"*.
    *   Show "Projected 10-Year Value" of their sobriety to make the numbers look massive ($50k+).

## 3. The Scan: "The Ritual"

**Goal:** Make the 30-second scan feel like a high-tech identity verification event (like FaceID on steroids).

*   **Immersive Mode:**
    *   When scanning starts, fade out *everything* except the Orb and the camera feed.
    *   Use haptic-style visual feedback (pulses) for each sensor success.
*   **The Payoff:**
    *   When complete, don't just say "Success". Say **"Identity Verified. Yield Unlocked."**
    *   Animation of "coins" or "particles" flowing from the Scan result into the Vault icon.

## 4. Global "Trend" Elements

*   **Shareable Artifact:**
    *   After a scan, offer a "Share Bio-Status" card (like Spotify Wrapped or specific crypto portfolio screenshots) that looks uniform and elite.
    *   *Text:* "AERO-92 // PURE // $580 LOCKED"

## Implementation Steps

1.  **Refine Dashboard (`/dashboard`)**:
    *   Import `AeroLogo` styles from Welcome.
    *   Implement "Percentile" logic (mocked for now).
2.  **Refine Vault (`/vault`)**:
    *   Add "Projected Value" calculation.
    *   Enhance visual separability of Locked vs Liquid.
3.  **Refine Scan (`/scan`)**:
    *   Implement "Immersive Mode" (hide Nav/Footer during scan).
    *   Update success state copy to be "Yield-focused".
