# Contributing to AERO

AERO is a modular, domain‑driven Next.js 15 application with strict Supabase pillar migrations, a liquid UI system, and a predictable engineering philosophy.  
This document defines the rules that keep the codebase clean, scalable, and future‑proof.

---

## 1. Migration Hygiene (Pillar‑Only)

AERO uses **pillar migrations** — one SQL file per domain, always edited in place.

### Rules
- **Never create timestamped fix migrations.**
- **Never patch the schema inline in production.**
- **Always write a test SQL file first** in `/supabase/tests`.
- Only after the test passes:
  - Merge the SQL into the pillar file.
  - Delete the test SQL.
  - Run full validation.
  - Sync to console:  
    `node supabase/scripts/sync_to_console.js`

### Pillar Files
```
0000_infra.sql
0001_identity.sql
0002_vault.sql
0003_bio.sql
0004_merits.sql
```

### Example
❌ `20260219011000_fix_vault_balance.sql`  
✅ Edit `0002_vault.sql` after test SQL passes

---

## 2. Naming Conventions

### Files
- Components: `AeroButton.tsx`, `AeroOrb.tsx`
- Hooks: `useAeroScore.ts`
- Context: `AuthProvider.tsx`
- Zustand store: `useAeroStore.ts`
- Utilities: `navigation.ts`, `rbac.ts`

### SQL
- Tables: `vaults`, `bio_scans`, `merits`
- Functions: `unlock_daily_reward()`
- Policies: `"Users can view their own vault"`

---

## 3. Module Boundaries

AERO is domain‑driven. Each module owns its logic.

```
/modules/auth        → Auth flows, session, guards
/modules/bio-engine  → Sensor pipeline (voice, PPG, face)
/modules/vault       → Bio-Vault logic + UI
/modules/score       → Aero Score logic + UI
/modules/ui          → Shadcn components (overridden)
```

### Rules
- **No cross‑module imports** except through `/lib`.
- **No business logic inside `/app`** — pages are shells only.
- **No UI logic inside modules other than `/ui`**.

---

## 4. UI Rules

AERO uses a **liquid, translucent, borderless** design system.

### Mandatory UI Rules
- Mobile‑first spacing: **`p-2` baseline** (never `p-4`).
- Transparent surfaces:  
  `bg-white/20` + `backdrop-blur-sm`
- No borders — use **inner shadows** for depth.
- All components must be **theme‑sensitive** (Eclipse/Cloud).
- All icons must be **lucide-react**.
- All text must use the **Bio‑Digital Hybrid font system**:
  - Geist → UI
  - Space Grotesk → headings
  - Satoshi → numbers

---

## 5. Commit Discipline

### Allowed
- `feat: add vault unlock animation`
- `fix: correct HRV delta calculation`
- `refactor: move score logic to module`
- `chore: sync supabase console`

### Not Allowed
- `fix stuff`
- `temp`
- `wip`

---

## 6. Anti‑Patterns

| ❌ Don’t | ✅ Do |
|---------|-------|
| Inline `router.push` | Use `useNavigator()` |
| Hardcoded colors | Use theme tokens |
| Create fix migrations | Update pillar file |
| Store raw biometrics | Store confidence scores only |
| Put logic in `/app` | Put logic in `/modules` |
| Use random spacing | Use `p-2` baseline |

---

## 7. Testing Workflow

1. Write test SQL in `/supabase/tests`.
2. Run via `test_runner.js`.
3. Verify output.
4. Merge into pillar file.
5. Delete test SQL.
6. Run full validation.
7. Sync to console.

---

## 8. Realtime & Performance Rules

- Always unsubscribe on unmount.
- Never subscribe to entire tables.
- Debounce scan events.
- Use `withRetry` for reads.
- Use `withTimeout` for RPCs.
- Keep triggers lightweight.

---

## 9. Philosophy

AERO is built on **clarity, discipline, and zero bloat**.  
Every contribution must preserve the liquid, premium, bio‑digital identity of the product.
```

---

# 🧠 **`SYSTEMS.md` — Deep Architecture**

```markdown
# AERO Systems Architecture

This document describes the internal systems that power AERO: state machines, edge functions, biometric pipelines, vault logic, score computation, and realtime sync.

---

# 1. High-Level Architecture

```
App Router → AppProviders → Modules → Supabase (Pillar Schema)
```

AERO is composed of five core systems:

6. **Linguistic System (Internationalization)**
7. **UI + Theme System**

---

# 1.5 Linguistic Interface Protocol

AERO is a multi-language sovereign environment.
- **State-Driven**: Language context is managed via `useAeroStore`.
- **Directional Flip**: Components must support `dir="rtl"` dynamically.
- **Translation Glossaries**: Clinical terms are defined in localized content dictionaries within each page shell to maintain high-fidelity context.
- **RTL Physics**: Motion paths (X-axis) and arrow icons are mirrored in Arabic context to preserve spatial logic. 

---

# 2. Handler Resilience & Build Safety

To ensure build-time stability in CI/CD environments (Vercel):
- **Deferred Initialization**: External clients (Supabase Admin, etc.) must be initialized **inside** the request handlers (e.g., `POST` function). 
- **Validation**: Environment variables are checked at runtime, preventing the "Collecting page data" build phase from crashing due to missing secrets.

---

# 3. Z-Index Hierarchy (The Depth Pillar)

To maintain structural clarity between the application content and sovereign UI:
- **Baseline Content**: `z-[0]` to `z-[50]`.
- **Overlays (Detox/Scan)**: `z-[200]`.
- **Sovereign UI (Sidebar/Notifications)**: 
    - Backdrops: `z-[800]`.
    - Panels/Sheets: `z-[810]`.
- **Tooltips/Topmost**: `z-[1000]`.

---

# 4. State Machines

## 2.1 Triple‑Check Scan State Machine

```
idle
 ↓ start
scanning
 ↓ success
verified
 ↓ write to supabase
completed
 ↓ failure
failed → idle
```

Transitions:
- `startScan()` → `scanning`
- `onSuccess()` → `verified`
- `onFailure()` → `failed`
- `reset()` → `idle`

---

# 3. Edge Function Flow

### `/api/bio/vocal`
- Input: jitter, shimmer, harmonicity
- Output: `confidence_vocal`

### `/api/bio/ppg`
- Input: HRV waveform
- Output: `confidence_ppg`

### `/api/bio/face`
- Input: perfusion metrics
- Output: `confidence_face`

### `/api/score`
- Input: clinical + biometric
- Output: `aeroScore`

### `/api/scan/complete`
- Writes scan result
- Triggers `unlock_daily_reward()`

---

# 4. Sensor Pipeline (Bio‑Engine)

## 4.1 Voice Scan
- WebAudio API
- Extracts:
  - jitter
  - shimmer
  - harmonicity

## 4.2 PPG Scan
- Camera + flash
- Extracts:
  - HRV
  - RMSSD
  - LF/HF ratio

## 4.3 Face Scan
- Video stream
- Extracts:
  - perfusion
  - micro‑color shifts

**Raw data never leaves the device.**

---

# 5. Vault Unlock Logic

### Trigger: `unlock_daily_reward()`

```
IF aeroScore > 80:
  spendable += 5
  locked -= 5
```

Constraints:
- One unlock per day
- Must be tied to a verified scan
- Realtime sync updates UI instantly

---

# 6. Aero Score Algorithm

```
AeroScore = f(ClinicalWeight, BiometricConfidence)
```

Inputs:
- Time since last cigarette
- Morning craving
- Vocal tension
- HRV delta
- Perfusion stability

Output:
- Integer 0–100

---

# 7. Bio-Digital Acoustic Protocol (Feedback)

AERO achieves a native-app feel through synchronized audio and haptic feedback.
- **Programmatic Audio**: Instead of MP3 assets, AERO uses the **Web Audio API** to generate sine-wave tones at specific frequencies (e.g., 880Hz for success). This ensures zero latency and zero asset bloat.
- **Haptic Integration**: Tactile pulses are delivered via the **Vibration API** on supported devices (Mobile/PWA).
- **Core Triggers**:
    - `Tap`: Subtle 440Hz click on button contact.
    - `Pulse`: Ethereal heartbeat during biometric scans.
    - `Success`: High-fidelity chime upon clinical verification.
    - `Error`: Dissonant triangle-wave tone for protocol failures.

---

# 8. Realtime Sync

Supabase channels push updates to:
- Vault balances
- Aero Score
- Merit level
- Scan history

Zustand store updates UI instantly.

---

# 8. Error States

| Error | Cause | Recovery |
|-------|--------|-----------|
| `SENSOR_DENIED` | No camera/mic permissions | Prompt user |
| `SCAN_TIMEOUT` | User took too long | Reset to idle |
| `LOW_CONFIDENCE` | Biometrics unstable | Retry scan |
| `NETWORK_FAIL` | Offline | Queue + retry |
| `RLS_DENIED` | Wrong role | RBACProvider fallback |

---

# 9. Module Interdependencies

```
auth → rbac → layout → bio-engine → score → vault → ui
```

Rules:
- No circular dependencies.
- `/modules/ui` depends on nothing.
- `/modules/bio-engine` depends only on browser APIs.
```

---

# 🎨 **`DESIGN.md` — The Alexander UI Canon**

```markdown
# AERO Design System — Alexander UI Canon

AERO uses a liquid, borderless, translucent design language. We prioritize **depth over color** and **type as interface**. Every screen must feel like a premium, bio-digital artifact.

---

## 1. The Alexander Fundamentals (The Canon)

### 1.1 The Ambient Void
The background is never flat black; it is a "Void" with depth.
*   **Base:** Pure Obsidian (`#000000`).
*   **Glow Layers:** Use ultra-soft blobs (`blur-[160px]`) with minimal opacity (`opacity-[0.03]`).
*   **Purpose:** Backgrounds must never "bleed" into content. They remain silent.

### 1.2 Type is Interface (Rule 30)
Typography is our primary design element.
*   **AERO Wordmark:** `font-light` + aggressive negative tracking (`tracking-[-0.07em]`).
*   **Visual Weight:** Use vertical gradients (`from-white via-white to-white/40`) to create an etched, metallic feel.
*   **Precision:** Use `Space Grotesk` for technical authority and `Geist` for clinical utility.

### 1.3 Liquid Glass (Droplet Aesthetic)
Surfaces behave like fluid captured in glass.
*   **Refraction:** `backdrop-blur-2xl` is the baseline for all overlays.
*   **Internal Depth:** No borders. Use `shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]` for top-edge light refraction.
*   **Sheen:** Apply a radial gradient highlight ("Liquid Sheen") that appears with intent (hover/focus).

### 1.4 Tactile Navigation
Interactions must feel physical and weighted.
*   **Iconography:** Icons conclude an action. Place them **after** text.
*   **The Guard:** Leading actions (like "Claim") use a right-aligned circular icon wrapper (`rounded-full bg-white/5`).
*   **Physics:** Use Framer Motion `spring` physics (`stiffness: 100`, `damping: 25`). No linear easings.
*   **Linguistic Mirroring:** In RTL mode (Arabic), icons and layout orientations are mirrored to respect the reading path while maintaining aesthetic weight. 

---

## 1.5 Color Has Meaning (Rule 7)
*   **Cyan (#00F5FF):** Vitality, Oxygen, Bio-Integrity.
*   **Obsidian (#000000):** The Private Void, Security.
*   **Red-Alert (#FF3B30):** Bio-Dissonance, Critical Load (Wake-Up Call).
*   **Gold (#D4AF37):** Sovereign Endowment, Vault Merit.

---

## 2. Design Tokens

### 2.1 Colors
- **--aero-blue:** `#00F5FF` (Oxygen/Bio)
- **--obsidian:** `#000000` (The Void)
- **--surface:** `rgba(255,255,255,0.03)` (Translucent Glass)
- **--text-muted:** `rgba(255,255,255,0.6)` (Subtext)

### 2.2 Typography
- **Headings:** Space Grotesk (Light or Medium)
- **UI:** Geist (Variable weight)
- **Numbers:** Satoshi (Monospaced alignment)

---

## 3. Component Architecture

### 3.1 AeroButton (The Droplet Pill)
- **Shape:** `rounded-full`.
- **Vertical:** `py-6` for a weighted, premium feel.
- **Micro-Animation:** Subtle "light sweep" (shimmer) on load to draw attention.
- **Horizontal:** `justify-between` with wide padding (`pl-10 pr-2`) to separate intent from execution.

### 3.2 AeroLogo
- **Geometry:** Custom Chevron 'A'.
- **Animation:** Staggered "blur-in" reveal over 1.8s.
- **Physics:** Gentle Y-axis breathing (floating).

---

## 4. UI Rules of Conduct
- **Rule 3:** Reveal gradually. Use `blur` transitions for entry.
- **Rule 20:** Premium lightness. Glass, not gloss.
- **Rule 24:** White space is luxury. Silence is intentional.
- **Rule 25:** Underpaid effect. The product feels expensive and effortless.

Every component must reinforce the idea that the user is interacting with a **living health system**, not a static app.
```
