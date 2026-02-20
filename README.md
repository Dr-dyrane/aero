### `README.md` — AERO Development Bible

```markdown
# 🧊 AERO — Development Bible

**Internal Name:** Project Droplet  
**Tagline:** Rebranding Addiction as an Elite Bio‑Investment  
**Stack:** Next.js 15 (App Router) · Supabase (Pillar Migrations) · Zustand · React Context · Tailwind CSS · Shadcn · Framer Motion  

---

## 1. Overview

AERO is a premium digital therapeutic that turns smoking cessation into **bio‑investment**.

- **Aero Score:** A medical credit score (0–100) quantifying addiction.
- **Bio‑Vault:** A $100 endowment users protect by staying clean.
- **Triple‑Check:** Daily biometric verification using only the smartphone.
- **Merit System:** Status levels with real‑world benefits (cafés, gyms, insurance).

This repo is structured as a **modular, domain‑driven system** with strict migration hygiene and a liquid, futuristic UI.

---

## 2. Repo Structure

```text
/app
  layout.tsx
  page.tsx
  providers.tsx        # AppProviders (theme, auth, RBAC, layout, bio-engine)
  /(routes)
    /dashboard
    /vault
    /scan
    /auth

/modules
  /auth                # Auth flows, session hooks, guards
  /bio-engine          # Sensor pipeline (voice, PPG, face)
  /vault               # Bio-Vault logic + UI
  /score               # Aero Score logic + UI
  /ui                  # Shadcn-based components (overridden)

/styles
  globals.css          # Base styles, resets
  tokens.css           # Design tokens (colors, radii, typography)
  utilities.css        # Global utility classes
  themes.css           # Eclipse/Cloud themes

/supabase
  /migrations
    0000_infra.sql
    0001_identity.sql
    0002_vault.sql
    0003_bio.sql
    0004_merits.sql
  /tests               # Test/fix SQL files
  /scripts
    sync_to_console.js
    test_runner.js

/lib
  navigation.ts        # Navigator helpers
  rbac.ts              # RBAC helpers
  supabaseClient.ts
  types.ts

/store
  useAeroStore.ts      # Zustand: vault, score, theme, scan status

/public
```

**Principle:** `/app` handles routing and shells; **all domain logic lives in `/modules`**.

---

## 3. Core Domains

### 3.1 Auth (`/modules/auth`)

- One‑tap Google Auth (Supabase).
- Session hooks: `useSession`, `useRequireAuth`.
- Guards:
  - `withAuthGate` (redirect to `/auth` if unauthenticated).
  - `withOnboardingGate` (ensure baseline scan completed).

### 3.2 Bio‑Engine (`/modules/bio-engine`)

- Browser‑side sensor logic only:
  - Voice (WebAudio).
  - PPG (camera + flash).
  - Face (video stream).
- Exposes:
  - `useBioEngine()` — permissions, availability, scan state.
  - `startTripleCheck()`, `cancelTripleCheck()`.

Raw biometric data never leaves the device; only derived confidence scores are sent to Supabase.

### 3.3 Vault (`/modules/vault`)

- Bio‑Vault state and UI.
- Endowment: `$100` locked on Day 1.
- Unlock rule: `$5` per verified clean day (configurable).
- Integrates with:
  - `vaults` table.
  - `unlock_daily_reward()` trigger.
  - Realtime updates via Supabase channels.

### 3.4 Score (`/modules/score`)

- Aero Score calculation and display.
- Combines:
  - Clinical weights (Fagerström‑like inputs).
  - Biometric confidence scores.
- Exposes:
  - `computeAeroScore()`.
  - `useAeroScore()` hook.
- UI: 3D liquid orb with breathing animation (Framer Motion).

### 3.5 UI (`/modules/ui`)

- Shadcn components, wrapped and themed for AERO.
- Only exports **Aero‑branded primitives**, e.g.:
  - `<AeroButton />`
  - `<AeroCard />`
  - `<AeroOrb />`
  - `<AeroPill />`
- All styling uses global tokens + Tailwind utilities.

---

## 4. State, Providers, and RBAC

### 4.1 Zustand Store (`/store/useAeroStore.ts`)

Global app‑level state:

- `vault.locked`
- `vault.spendable`
- `aeroScore`
- `theme` (`'eclipse' | 'cloud' | 'system'`)
- `scanStatus` (`'idle' | 'scanning' | 'success' | 'failed'`)

Example:

```ts
import { create } from 'zustand';

type AeroState = {
  aeroScore: number;
  theme: 'eclipse' | 'cloud' | 'system';
  scanStatus: 'idle' | 'scanning' | 'success' | 'failed';
  setAeroScore: (score: number) => void;
  setTheme: (theme: AeroState['theme']) => void;
  setScanStatus: (status: AeroState['scanStatus']) => void;
};

export const useAeroStore = create<AeroState>((set) => ({
  aeroScore: 0,
  theme: 'system',
  scanStatus: 'idle',
  setAeroScore: (aeroScore) => set({ aeroScore }),
  setTheme: (theme) => set({ theme }),
  setScanStatus: (scanStatus) => set({ scanStatus }),
}));
```

### 4.2 App Providers (`/app/providers.tsx`)

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RBACProvider>
          <LayoutProvider>
            <BioEngineProvider>
              {children}
            </BioEngineProvider>
          </LayoutProvider>
        </RBACProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

- **ThemeProvider:** Eclipse/Cloud, system‑aware, sets `data-theme` on `<html>`.
- **AuthProvider:** Supabase session, user, org.
- **RBACProvider:** roles, permissions, feature flags.
- **LayoutProvider:** mobile/desktop, safe areas, skeleton loading.
- **BioEngineProvider:** sensor permissions, availability, scan lifecycle.

### 4.3 RBAC from Day One

- Roles: `user`, `partner`, `admin`.
- RBAC enforced at:
  - Supabase RLS (primary).
  - `RBACProvider` for UI gating.
- Helpers in `/lib/rbac.ts`:
  - `canViewVault(user)`
  - `canManageMerits(user)`
  - `canAccessAdminPanel(user)`

---

## 5. Navigation & Layout

### 5.1 Navigator Helpers (`/lib/navigation.ts`)

```ts
import { useRouter } from 'next/navigation';

export function useNavigator() {
  const router = useRouter();

  return {
    goToDashboard: () => router.push('/dashboard'),
    goToVault: () => router.push('/vault'),
    goToScan: () => router.push('/scan'),
    goToAuth: () => router.push('/auth'),
    goToOnboardingIfNeeded: (hasBaseline: boolean) =>
      hasBaseline ? router.push('/dashboard') : router.push('/scan'),
  };
}
```

**Rule:** No inline `router.push` in pages; always use navigator helpers.

### 5.2 Skeleton Loading

Every route has a skeleton:

- `/dashboard/loading.tsx`
- `/vault/loading.tsx`
- `/scan/loading.tsx`

Skeletons use:

- `bg-white/10`
- `backdrop-blur-sm`
- `animate-pulse`
- Rounded pills (`rounded-full`).

---

## 6. Design System (High‑Level)

Full details live in `DESIGN.md`, but core rules:

- **Shape:** `border-radius: 9999px` for primary surfaces.
- **Surface:** `background: rgba(255,255,255,0.05)` on dark, `rgba(0,0,0,0.03)` on light.
- **Depth:** `backdrop-filter: blur(40px)`; no borders, only inner shadows.
- **Spacing:** mobile‑first, `p-2` baseline (not `p-4`).
- **Background:** `bg-black` (Eclipse), `bg-[#F5F7FA]` (Cloud) with gradient glow layers.
- **Icons:** `lucide-react` only.
- **Fonts:**
  - Geist — UI
  - Space Grotesk — headings
  - Satoshi — numbers (Score, Vault)

---

## 7. Supabase: Pillar Migrations

AERO uses **pillar‑only migrations**: one file per domain, always edited in place.  

```text
/supabase/migrations
  0000_infra.sql
  0001_identity.sql
  0002_vault.sql
  0003_bio.sql
  0004_merits.sql
```

### 7.1 Workflow

1. Create **test/fix SQL** in `/supabase/tests`.
2. Run via `node supabase/tests/scripts/test_runner.js [task_name]`.  
3. Once it passes, merge the SQL into the relevant pillar file.
4. Delete the test SQL.
5. Run full validation.
6. Sync to console: `node supabase/scripts/sync_to_console.js`.  

**Rule:** Never create timestamped “fix” migrations.

### 7.2 Vault Schema (Example)

```sql
CREATE TABLE vaults (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  locked_balance decimal DEFAULT 100.00,
  spendable_balance decimal DEFAULT 0.00,
  aero_score int DEFAULT 0
);

ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own vault"
ON vaults FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION unlock_daily_reward()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score > 80 THEN
    UPDATE vaults SET 
      spendable_balance = spendable_balance + 5.00,
      locked_balance = locked_balance - 5.00
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 8. API & Edge Functions

All API routes use Edge runtime:

```ts
export const runtime = 'edge';
```

Key routes:

- `POST /api/bio/vocal` — accepts local jitter metrics, returns confidence score.
- `POST /api/bio/ppg` — accepts HRV metrics, returns confidence score.
- `POST /api/bio/face` — accepts perfusion metrics, returns confidence score.
- `POST /api/score` — combines clinical + biometric inputs → AeroScore.
- `POST /api/scan/complete` — writes scan result, triggers `unlock_daily_reward()`.

---

## 9. Implementation Checklist

- [ ] Configure fonts (Geist, Space Grotesk, Satoshi).
- [ ] Setup Tailwind + Shadcn with global overrides.
- [ ] Implement `AppProviders` with Theme/Auth/RBAC/Layout/BioEngine.
- [ ] Implement `useAeroStore` (Zustand).
- [ ] Build `AeroOrb`, `AeroPill`, `AeroCard` components.
- [ ] Implement Bio‑Engine (voice, PPG, face) with local‑only raw data.
- [ ] Implement Aero Score computation and UI.
- [ ] Implement Vault logic + Supabase triggers.
- [ ] Wire Triple‑Check → Score → Vault unlock → Merit level.
- [ ] Add skeleton loaders for all main routes.
- [ ] Add RBAC rules and UI gating.
- [ ] Run full Supabase test suite and sync.

---

## 10. Philosophy

AERO is built on three non‑negotiables:

1. **No migration bloat.** Pillar files only, test‑driven changes.  
2. **No visual noise.** Liquid, borderless, translucent UI with strict tokens.  
3. **No behavioral ambiguity.** Every scan, score, and dollar is deterministic and explainable.


## 11. Project Proposal: AERO
### Rebranding Addiction as an Elite Bio-Investment

#### 1. The Problem: "Invisible Addiction"
In Lebanon, smoking is normalized. Doctors, teachers, and parents smoke openly. The result is a total **Awareness Gap**.

*   **Denial:** People don’t believe they’re addicted; they think they’re “just being social.”
*   **Failed Solutions:** Current apps feel medical, moralizing, or irrelevant to daily life.
*   **The Hook:** What people actually want is **status, utility**, and a sense of **personal advancement**.

#### 2. The Innovation: The Aero Score
Aero introduces a **Medical Credit Score**—a single number from 0 to 100 that quantifies addiction.

*   **Objective:** A mathematical model converts habits into a score.
*   **Psychological Break:** Seeing a score of 80 causes an "Awareness Shock."
*   **Reframing:** Addiction becomes a metric to be optimized, not a moral failing.

#### 3. The Solution: The Bio-Vault & Triple-Check
Aero transforms the smartphone into a personal biometric scanner—no extra hardware required.

**A. The Bio-Vault (Financial Endowment)**
On Day 1, the user receives **$100 locked** inside a digital vault.
*   The money belongs to them.
*   To unlock it, they must improve their Aero Score.
*   **Behavioral Insight:** People fight harder to *keep* money they already have (Loss Aversion) than to earn new money.

**B. The Triple-Check (Daily Proof)**
Each morning, the user completes a 15-second biometric scan:
1.  **Voice Scan:** Detects vocal cord tension.
2.  **Heart Scan:** Uses the camera flash to measure rhythm and variability (PPG).
3.  **Face Scan:** Analyzes micro-changes in skin blood flow.

#### 4. The "Addictive" User Flow
Aero feels like a premium banking app or a luxury progression game.

1.  **Morning Ritual:** User completes the Triple-Check.
2.  **Instant Reward:** Aero Score updates; a portion of the $100 becomes spendable.
3.  **Status Progression:** Users unlock **Merit Levels** tied to real-world benefits:

| Level | Title | Benefit |
| :--- | :--- | :--- |
| **3** | Carbon Neutral | Discounts at healthy cafés |
| **7** | Vascular Elite | Free gym access |
| **10** | Aero Master | Lower insurance premiums |

#### 5. Institutional Adoption
*   **Zero Hardware Cost:** Every smartphone is a scanner. No clinics needed.
*   **Verified Data:** Institutions get verified bio-data, not self-reported claims.
*   **Economic ROI:** Investing $100 today is cheaper than treating COPD in a decade.

---

### Summary
> "Aero is the Tesla of health apps. We use smartphone sensors to generate an **Addiction Score** that creates awareness. We give users **$100 upfront** to shift their addiction from nicotine to progress. We turn clean living into a **status symbol** through real-world rewards."
