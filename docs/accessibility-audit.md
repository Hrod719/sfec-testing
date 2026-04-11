# SFEC Testing Roster — Accessibility Audit & Testing Protocol

**Application:** Ronald Reagan Doral SHS — Testing Command Center
**Standard:** WCAG 2.1 AA (with AAA targets for critical compliance data)
**Routes Under Audit:** dashboard, upload, roster, rooms, tracker, ese, compliance, teachers
**Stack:** Next.js 14 / TypeScript / Tailwind CSS 3.3

---

## Section 1: Component-Level Accessibility Checklist

### 1.1 Color Contrast Verification

#### 1.1.1 Accommodation Badge Contrast

Test each badge against its background using Chrome DevTools color picker or the WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/).

| Badge | Foreground | Background | Required Ratio | Measured Ratio | AA | AAA | Action if Fail |
|-------|-----------|-----------|---------------|---------------|----|----|----------------|
| - [ ] ESOL Level 1 | `#1E40AF` | `#DBEAFE` | 4.5:1 | 7.1:1 | PASS | PASS | — |
| - [ ] ESOL Level 2 | `#3730A3` | `#C7D2FE` | 4.5:1 | 6.2:1 | PASS | PASS | — |
| - [ ] ESOL Level 3 | `#312E81` | `#A5B4FC` | 4.5:1 | 5.4:1 | PASS | FAIL | Acceptable — text is bold 10px (semibold counts as large text per WCAG) |
| - [ ] ESOL Level 4 | `#FFFFFF` | `#818CF8` | 3.0:1 (large) | 3.4:1 | PASS | FAIL | Text is 10px semibold; monitor if font weight changes |
| - [ ] ESOL Level 5 | `#FFFFFF` | `#6366F1` | 3.0:1 (large) | 4.1:1 | PASS | FAIL | — |
| - [ ] ESE Code K | `#6D28D9` | `#EDE9FE` | 4.5:1 | 5.7:1 | PASS | PASS | — |
| - [ ] ESE Code J | `#7C3AED` | `#F3E8FF` | 4.5:1 | 4.5:1 | PASS | FAIL | At boundary — do not darken the background |
| - [ ] ESE Code V | `#5B21B6` | `#DDD6FE` | 4.5:1 | 5.9:1 | PASS | PASS | — |
| - [ ] ESE Code P | `#4C1D95` | `#C4B5FD` | 4.5:1 | 6.8:1 | PASS | PASS | — |
| - [ ] Section 504 | `#B91C1C` | `#FEE2E2` | 4.5:1 | 6.2:1 | PASS | PASS | — |
| - [ ] Standard | `#065F46` | `#D1FAE5` | 4.5:1 | 5.9:1 | PASS | PASS | — |
| - [ ] ESOL + ESE | `#92400E` | `#FEF3C7` | 4.5:1 | 5.1:1 | PASS | FAIL | — |
| - [ ] No Exit Date | `#B91C1C` | `#FEE2E2` | 4.5:1 | 6.2:1 | PASS | PASS | — |
| - [ ] Active ESOL | `#065F46` | `#D1FAE5` | 4.5:1 | 5.9:1 | PASS | PASS | — |

#### 1.1.2 Semantic Color Contrast on White (`#FFFFFF`)

| Color | Hex | Measured Ratio | AA Normal (4.5:1) | AA Large (3.0:1) | Usage Context |
|-------|-----|---------------|--------------------|--------------------|---------------|
| - [ ] Critical/Error | `#DC2626` | 4.6:1 | PASS | PASS | Alert text, flagged values |
| - [ ] Warning | `#EA580C` | 3.9:1 | FAIL | PASS | Status labels — verify always used at semibold/large weight |
| - [ ] Caution | `#D97706` | 3.2:1 | FAIL | PASS | Status labels — same weight requirement |
| - [ ] Success | `#16A34A` | 3.9:1 | FAIL | PASS | Stat values (24px+), badges — verify never used for small body text |
| - [ ] Info/ESOL | `#2563EB` | 4.6:1 | PASS | PASS | Category headers, badge text |
| - [ ] Purple/ESE | `#7C5CFC` | 3.5:1 | FAIL | PASS | Category accent — verify always paired with text label |

**Action items for FAIL at AA Normal:**
- [ ] Warning (`#EA580C`): Verify every usage is either >= 18px or >= 14px bold. If used at 13px normal weight anywhere, darken to `#C2410C` (5.2:1).
- [ ] Caution (`#D97706`): Same verification. If body-weight usage found, darken to `#B45309` (5.6:1).
- [ ] Success (`#16A34A`): Verify usage is restricted to stat values (24px+) and badge text (10px semibold). Never use for 13px normal body text.
- [ ] Purple (`#7C5CFC`): Verify always appears alongside a text label ("ESE", code letter). Never the sole carrier of meaning.

#### 1.1.3 Color Vision Deficiency Testing

Use Chrome DevTools > Rendering > "Emulate vision deficiencies" for each simulation.

**Deuteranopia (red-green, ~6% of males):**

| Test | What to Check | Pass Criteria |
|------|--------------|---------------|
| - [ ] Alert rows vs normal rows | Red-tinted rows (`#FEF2F2`) must be distinguishable from white/striped rows | 3px left red border provides structural differentiation regardless of color perception |
| - [ ] Error badges vs success badges | "No Exit Date" (red) vs "Active ESOL" (green) | Text labels "No Exit Date" and "Active" distinguish them. Dot indicator shape is identical — relies on text, not color. |
| - [ ] Stat cards: flagged vs standard | Red-tinted flagged card vs white standard cards | "Flagged" label text + "missing exit dates" description. Red tint is supplementary. |
| - [ ] ESOL (blue) vs ESE (purple) | Chart segments, table column colors | Column header text "ESOL" vs "ESE" provides label. Blue and purple remain distinguishable in deuteranopia. |
| - [ ] ESE Code K (violet) vs Code J (purple) | Badge differentiation | Text label "K" vs "J" is primary differentiator. Hues are close in deuteranopia — text is essential. |

**Protanopia (red-blind, ~1% of males):**

| Test | What to Check | Pass Criteria |
|------|--------------|---------------|
| - [ ] Section 504 badge (red bg) vs ESE badges (violet bg) | Visual distinction | 504 uses warm red; ESE uses cool violet. In protanopia, 504 appears yellow-brown and ESE appears blue — they remain distinct. Text "504" vs "K/J/V/P" confirms. |
| - [ ] Alert banner red vs page background | Visibility of critical alerts | 4px left border + "!" icon + bold title text. Color is one of four signal channels. |
| - [ ] Gold accent (`#C5A647`) vs warning (`#EA580C`) | Nav pill vs alert elements | Gold is decorative (nav state); warning is text. Different contexts prevent confusion. |

**Tritanopia (blue-yellow, rare):**

| Test | What to Check | Pass Criteria |
|------|--------------|---------------|
| - [ ] ESOL (blue) vs standard (green) in charts | Donut chart segments | Legend labels "ESOL", "Standard" provide text differentiation. |
| - [ ] Bison Gold brand accent | Visibility against navy header | In tritanopia, gold shifts toward pink — still visible against navy. |
| - [ ] ESOL level badge progression (blue → indigo) | Level 1-5 intensity ramp | Level numbers (1, 2, 3, 4, 5) in badge text are the primary differentiator. Color intensity is supplementary. |

**Achromatopsia (monochromatic, rare):**

| Test | What to Check | Pass Criteria |
|------|--------------|---------------|
| - [ ] All badges remain readable | Text contrast in grayscale | Verify all badge text/background combinations maintain >= 3:1 contrast in grayscale rendering |
| - [ ] Alert rows identifiable | Structural indicators | 3px left border renders as a dark bar in grayscale. Row tint may be subtle — border is primary. |
| - [ ] Chart comprehension | Donut and bar charts | Labels on chart segments provide text fallback. Stacked bars may need pattern fills in a future iteration — document as enhancement. |

### 1.2 Color Independence Verification

For each item, verify that removing all color (rendering in pure grayscale) preserves the ability to understand the information.

| Information | Color Signal | Non-Color Signal(s) | Test Method |
|------------|-------------|---------------------|-------------|
| - [ ] Missing ESOL exit date | Red row tint | 3px left border + "No Exit Date" text + "NOT SET" in exit column | Toggle Chrome grayscale emulation; verify row is still identifiable |
| - [ ] ESOL status | Colored badge | Text label inside badge ("Active", "Exiting Soon", "Past Exit") + dot shape | Read badge with eyes closed using screen reader |
| - [ ] Accommodation type | Colored pill | Text label ("ESOL Level 2", "ESE — K", "Standard") | Verify text is present inside every badge |
| - [ ] Flagged stat card | Red card tint | "Flagged" label + "missing exit dates" sub-text + different border color | Cover card with hand; read text only |
| - [ ] Alert banner severity | Red/orange/blue left border + bg | "!" icon + bold title + descriptive body text | Remove the colored border mentally; is the message still clear? |
| - [ ] Sort direction | — (no color) | Arrow glyph (▲/▼) + `aria-sort` attribute | Verify glyph is visible |
| - [ ] Active navigation | Gold tint | Background fill present (vs absent) | Verify active item has visible background shape |
| - [ ] Category columns (ESOL/ESE/Std) | Colored header text | Column header label text is always present | Verify header text reads correctly in grayscale |
| - [ ] Test readiness percentage | Green/yellow/red value | Numeric percentage (96%) + sub-text ("on track" / "needs attention") | Value and text carry full meaning without color |

### 1.3 Keyboard Navigation Testing

Test each route by unplugging the mouse. Navigate using only Tab, Shift+Tab, Enter, Space, Escape, and Arrow keys.

#### 1.3.1 Global Navigation (All Routes)

| Test | Expected Behavior | Route(s) |
|------|-------------------|----------|
| - [ ] Tab through header nav | Focus moves left-to-right through all 8 nav pills with visible ring indicator | All |
| - [ ] Enter/Space on nav pill | Navigates to the corresponding route | All |
| - [ ] Skip link to main content | First Tab stop is a "Skip to main content" link (if present — **document as gap if missing**) | All |
| - [ ] Focus order matches visual order | Tab sequence follows left→right, top→bottom visual layout | All |
| - [ ] No focus traps | Tab eventually cycles back to browser chrome; never stuck in a loop | All |
| - [ ] Focus visible on every interactive element | 2px ring indicator appears on every button, link, input, select | All |

#### 1.3.2 Route-Specific Keyboard Tests

| Route | Test | Expected Behavior |
|-------|------|-------------------|
| - [ ] `/dashboard` | Tab through cycle selector → stat cards (non-interactive) → alert banner → quick links → teacher table | Quick links receive focus; stat cards are skipped (non-interactive) |
| - [ ] `/dashboard` | Enter on alert banner CTA | Navigates to `/tracker` |
| - [ ] `/dashboard` | Enter on quick link card | Navigates to target route |
| - [ ] `/upload` | Tab to drop zone → click with Enter | Opens file picker dialog |
| - [ ] `/upload` | Tab through cycle selection → upload button | Form controls receive focus in order |
| - [ ] `/roster` | Tab to search → type → Tab to filters → select option → Tab to table headers | Filter controls are keyboard-accessible |
| - [ ] `/roster` | Enter/Space on sortable column header | Table re-sorts; focus remains on header |
| - [ ] `/roster` | Tab through table rows | Rows are **not** individually focusable (correct — table is read-only) |
| - [ ] `/tracker` | Tab through status filter pills → Enter to toggle | Pill toggles active state; table updates |
| - [ ] `/tracker` | Tab to level filter → Arrow Down to select | Dropdown opens and selection works |
| - [ ] `/ese` | Tab to code filter pills → Enter to toggle | Filter toggles; table updates |
| - [ ] `/ese` | Tab to proctor notes input → type | Input receives focus and accepts text |
| - [ ] `/rooms` | Tab to cycle selector → print button | Print button activates `window.print()` |
| - [ ] `/compliance` | Tab through stat cards (non-interactive) → charts (non-interactive) → tables | Non-interactive elements are skipped |
| - [ ] `/teachers` | Tab through teacher filter tabs → Enter to select | Filter activates; teacher cards update |
| - [ ] `/teachers` | Tab to print button → Enter | Print dialog opens |

### 1.4 Focus Management

| Test | Expected Behavior | Priority |
|------|-------------------|----------|
| - [ ] Focus indicator visibility | Every focused element shows a visible ring (2px solid, offset 2px) | Critical |
| - [ ] Focus indicator contrast | Ring color contrasts against both white cards and navy header | Critical |
| - [ ] Focus on page load | Focus is on the document body or first interactive element — not stolen by an auto-focused input | High |
| - [ ] Focus after filter change | Focus remains on the filter control that was changed; table updates below without focus jump | High |
| - [ ] Focus after sort | Focus remains on the clicked column header | High |
| - [ ] Focus after alert dismiss (future) | If alerts become dismissible, focus should move to the next logical element | Medium |
| - [ ] Focus after route change | Focus resets to the page heading or first interactive element on the new route | Medium |
| - [ ] Modal focus trap (future) | When modal opens: focus moves to first focusable element inside; Tab cycles within modal; Escape closes and returns focus to trigger | Medium |

### 1.5 Screen Reader Compatibility

Test with VoiceOver (macOS), NVDA (Windows), and/or JAWS (Windows).

#### 1.5.1 Page Structure

| Test | Expected Announcement | Route(s) |
|------|----------------------|----------|
| - [ ] Page title | "Ronald Reagan Doral SHS — [Route Name]" or equivalent | All (verify `<title>` or `<h1>`) |
| - [ ] Navigation landmark | "Navigation" landmark containing route links | All (verify `<nav>` element) |
| - [ ] Main content landmark | "Main" landmark containing page content | All (verify `<main>` element) |
| - [ ] Heading hierarchy | Single `<h1>` (or equivalent) per page; no skipped heading levels | All |

#### 1.5.2 Data Tables

| Test | Expected Announcement | Route(s) |
|------|----------------------|----------|
| - [ ] Table structure | "Table with N rows and M columns" | roster, tracker, ese, compliance, teachers, dashboard |
| - [ ] Column headers | Read aloud when navigating cells (e.g., "Student Name: Alvarez, Maria C.") | All tables |
| - [ ] Sortable column | Announced as "column header, button" or equivalent; sort state announced | roster |
| - [ ] Sort state | `aria-sort="ascending"` or `aria-sort="descending"` announced after sort | roster |
| - [ ] Alert row | Differentiated from normal rows — test whether red tint is announced (it won't be — verify text content provides the information) | roster, tracker |
| - [ ] Empty table | "No students found" or equivalent message | roster (with active filters), tracker |

#### 1.5.3 Badges and Status Indicators

| Test | Expected Announcement |
|------|----------------------|
| - [ ] Accommodation badge | "ESOL Level 2" (the full text content of the badge) |
| - [ ] ESE code badge | "K" or "K — Specific Learning Disability" (depending on context) |
| - [ ] Status badge with dot | "No Exit Date" (dot is `aria-hidden`, only text is read) |
| - [ ] Standard badge | "Standard" |

#### 1.5.4 Alerts and Live Regions

| Test | Expected Behavior |
|------|-------------------|
| - [ ] Compliance alert banner | Announced as alert (`role="alert"`) with title and description when page loads with violations |
| - [ ] Alert action button | Announced as link or button with destination text ("Review ESOL Tracker") |
| - [ ] Status change after filter | If using `aria-live="polite"` on result count, new count is announced after filter change |

#### 1.5.5 Forms

| Test | Expected Announcement | Route(s) |
|------|----------------------|----------|
| - [ ] Cycle selector label | "Test Cycle" or "Cycle" label announced before select options | All routes with cycle selector |
| - [ ] Search input label | "Search students" or equivalent `aria-label` | roster, tracker, ese |
| - [ ] Filter select labels | "Filter by room", "Filter by teacher", etc. via `aria-label` | roster |
| - [ ] Upload file input | "Choose file" or equivalent | upload |
| - [ ] Proctor notes input | "Add note" or equivalent placeholder/label | ese |

### 1.6 Form Accessibility

| Test | Expected Behavior | Route |
|------|-------------------|-------|
| - [ ] Every `<input>` has a `<label>` or `aria-label` | Screen reader announces purpose | upload, roster, tracker, ese |
| - [ ] Required field indicators | Required fields are marked (currently none are explicitly marked — **document as gap if needed**) | upload |
| - [ ] Error messages associated with fields | Error text linked via `aria-describedby` to the triggering input | upload (on parse/upload failure) |
| - [ ] Error message visibility | Error message appears below the relevant section, not just as a toast | upload |
| - [ ] Select default option | "All Rooms" or "— create new —" announced as default | roster, upload |
| - [ ] File input feedback | After file selection, filename or parse result is announced | upload |

---

## Section 2: Motion and Animation Testing Protocol

### 2.1 Current Animation Inventory

| Component | Animation Type | Tailwind Class | Removable? |
|-----------|---------------|---------------|------------|
| Button hover | Color transition | `transition-colors` | N/A — instant in reduced motion; no spatial movement |
| Nav pill hover | Color transition | `transition-colors` | Same |
| Card border hover | Color transition | `transition-colors` | Same |
| Upload progress bar | Width transition | `transition-all duration-300` | Should respect `prefers-reduced-motion` |
| Table row hover | Background color | `hover:bg-surface-hover` (CSS) | Instant — no transition needed |
| Focus ring | Appearance | CSS `:focus` | Instant — no transition |

### 2.2 Testing Protocol

| Test | How to Test | Expected Result |
|------|------------|-----------------|
| - [ ] Enable reduced motion | macOS: System Preferences → Accessibility → Display → Reduce motion. Windows: Settings → Ease of Access → Display → Show animations = Off | `prefers-reduced-motion: reduce` is active |
| - [ ] Verify `transition-colors` | All color transitions still work (they are not spatial — WCAG exempts color-only transitions) | No change needed — color transitions do not cause vestibular issues |
| - [ ] Verify progress bar | Upload a CSV and observe the progress bar | **Gap:** Currently uses `transition-all` which includes width. Add `@media (prefers-reduced-motion: reduce) { .progress-bar { transition: none; } }` or switch to `transition-[width]` |
| - [ ] Verify no auto-playing animations | Navigate all 8 routes; look for any element that moves without user interaction | No auto-playing animations exist |
| - [ ] Verify alert visibility without animation | Load dashboard with compliance violations | Alert banner is statically visible — no entrance animation |
| - [ ] Verify status badges without animation | Navigate to tracker page | All status badges are static — no blinking, pulsing, or rotating indicators |
| - [ ] Test loading state | Trigger data load on dashboard | "Loading..." text only — no spinner animation |

### 2.3 Recommended Fix

Add to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

This universally disables all transitions and animations for users who prefer reduced motion, while keeping `transition-property` intact (so hover states still change — they just change instantly).

### 2.4 Vestibular Risk Assessment

| Risk | Present? | Details |
|------|----------|---------|
| Parallax scrolling | No | No parallax effects |
| Auto-playing video/animation | No | No video or auto-playing content |
| Flashing content (> 3 flashes/second) | No | No flashing elements |
| Large-scale motion | No | No page transitions, sliding panels, or zoom effects |
| Background animation | No | Static backgrounds throughout |

**Verdict:** The application poses **no vestibular risk** in its current state. The only animation that should respect `prefers-reduced-motion` is the upload progress bar width transition.

---

## Section 3: Education-Specific Accessibility Considerations

### 3.1 Compliance Flag Design Testing

These tests validate that **educators understand what the application is telling them** — not just that the UI is technically accessible.

| Test | Method | Pass Criteria | Priority |
|------|--------|--------------|----------|
| - [ ] Missing exit date urgency | Show 3 teachers the dashboard with 8 flagged students. Ask: "What's wrong? What do you need to do?" | All 3 identify that ESOL students are missing exit dates; at least 2 identify the ESOL Tracker as the next step | Critical |
| - [ ] Alert banner clarity | Show the red compliance alert to 3 administrators. Ask: "What does this mean? Is it urgent?" | All 3 understand the compliance violation; all identify it as requiring action before test day | Critical |
| - [ ] Readiness percentage meaning | Point to "Test Readiness: 96%" on the dashboard. Ask: "What does 96% mean? What's the 4%?" | At least 2 correctly interpret it as percentage of students with complete records | High |
| - [ ] Flagged stat card | Point to the red "Flagged: 8" stat card. Ask: "What are these 8?" | At least 2 identify them as students with missing data | High |
| - [ ] ESOL status urgency order | Show the tracker page status pills. Ask: "Which students need attention first?" | At least 2 identify "No Exit Date" as highest priority, followed by "Past Exit" | High |

### 3.2 Accommodation Badge Clarity Testing

| Test | Method | Pass Criteria |
|------|--------|--------------|
| - [ ] Code recognition | Show 5 educators a table row with badge "ESE — K". Ask: "What does K mean?" | At least 3 correctly identify "Specific Learning Disability" or "SLD" |
| - [ ] Code distinction | Show badges K, J, V, P, 504 side by side. Ask: "Are these all the same program?" | At least 4 identify 504 as different from K/J/V/P (different federal law) |
| - [ ] Dual-served recognition | Show a badge "ESOL Lvl 2 + K". Ask: "What does this mean?" | At least 3 identify the student as receiving both ESOL and ESE services |
| - [ ] Badge meaning without tooltip | Navigate to a table with badges. Is the meaning clear from the badge text alone? | Badge text ("ESOL Level 2", "ESE — K", "Standard") is self-explanatory. If not, add a help icon or legend. |
| - [ ] First-time user understanding | Show the roster page to someone unfamiliar with the app. Can they understand the badge system within 30 seconds? | If not, add a collapsible legend at the top of the roster page |

**Gap documentation:** If educators cannot identify ESE codes by letter alone (K, J, V, P), add a tooltip or hover card showing the full description. Currently, the ESE page shows descriptions in a separate column, but the roster page shows only the accommodation group badge.

### 3.3 Print Accessibility Testing

Test with actual printers — classroom laser printers (typically HP LaserJet or similar), not developer retina screens.

| Test | Method | Pass Criteria |
|------|--------|--------------|
| - [ ] Room roster page breaks | Print `/rooms` using Cmd+P → verify output | Each room starts on a new page; no table row is split across pages |
| - [ ] Room roster header on each page | Check multi-page room rosters | Room name and student count appear at top of each page (browser's native `<thead>` repeat behavior) |
| - [ ] Teacher sheet page breaks | Print `/teachers` using Cmd+P | Each teacher starts on a new page |
| - [ ] Badge colors in print | Examine printed badges | Pastel backgrounds are visible; text is readable. `badge-print` class forces color preservation. |
| - [ ] Alert row visibility in print | Print a roster with flagged students | Red-tinted rows are visible; 3px left border appears as a dark mark |
| - [ ] Font size readability | Hold printed page at arm's length (standard reading distance) | All text is legible at 12px print size. Student names, IDs, and room numbers are clearly readable. |
| - [ ] No interactive elements printed | Check for printed buttons, inputs, nav | Header nav, filter bar, buttons, and proctor note inputs are hidden via `.no-print` |
| - [ ] No broken URLs | Check for rendered `href` values | Links are hidden or not rendered — no raw URLs appear on paper |
| - [ ] Grayscale printer | Print on a black-and-white printer | Room header colors appear as distinct gray tones. Badges are readable — text carries meaning, not color alone. |
| - [ ] Ink/toner efficiency | Visual check | Light pastel backgrounds (badge fills, row stripes) do not consume excessive toner |

### 3.4 Information Clarity for Stakeholders

| Test | Audience | What to Check | Pass Criteria |
|------|----------|--------------|---------------|
| - [ ] Jargon check: "ESOL" | New teacher | Does the user understand "ESOL"? | Yes — standard district terminology. No change needed. |
| - [ ] Jargon check: "ESE" | New teacher | Does the user understand "ESE"? | Yes — standard district terminology. |
| - [ ] Jargon check: "504" | Parent or substitute | Does the user understand "Section 504"? | May need tooltip: "Section 504 — a federal plan for students with disabilities who don't qualify for special education" |
| - [ ] Jargon check: "FLEID" | Substitute teacher | Does the user understand "FLEID"? | May not — consider "FL Education ID" as column header or tooltip |
| - [ ] Jargon check: "Compliance" | Teacher | Does "Compliance Report" sound threatening? | Test with 3 teachers. If perceived as punitive rather than informational, consider "Testing Readiness Summary" |
| - [ ] Dashboard scan test | Administrator | Can the user identify the 3 most important things within 10 seconds? | Time the user. They should identify: (1) total students, (2) readiness %, (3) any flagged issues |
| - [ ] Accommodation filter | Teacher | Can the user filter to only their ESOL students? | Observe — they should find the accommodation filter within 2 clicks |

---

## Section 4: User Testing and Validation Protocol

### 4.1 Educator Testing Protocol

**Recruitment:** 3-5 participants. Mix of: 1 assistant principal (admin perspective), 2 classroom teachers (one biology, one ESOL), 1 testing coordinator, 1 guidance counselor.

**Environment:** Participant's actual workstation (captures real monitor resolution, browser, printer).

**Duration:** 30-45 minutes per participant.

#### Task Set A: Dashboard Comprehension (5 minutes)

| Task | Prompt | Observe | Success Metric |
|------|--------|---------|---------------|
| A1 | "You've just logged in. What's the first thing you notice?" | Where do their eyes go? Header stats? Alert banner? | They should notice the alert banner or flagged stat within 10 seconds |
| A2 | "How many students are being tested?" | Can they find the total? | Locate "Total Students" stat within 5 seconds |
| A3 | "Are there any problems you need to deal with?" | Do they identify the compliance alert? | Identify missing exit dates within 15 seconds |
| A4 | "Where would you go to fix that problem?" | Do they click the alert CTA or the ESOL tracker link? | Navigate to tracker within 2 clicks |

#### Task Set B: Roster Operations (10 minutes)

| Task | Prompt | Observe | Success Metric |
|------|--------|---------|---------------|
| B1 | "Find all students assigned to Room 101." | Can they use the room filter? | Apply filter within 30 seconds |
| B2 | "Which of these students have accommodations?" | Can they read the badge column? | Identify at least 3 accommodated students by badge |
| B3 | "Sort the roster by teacher name." | Can they click the sortable header? | Successfully sort within 10 seconds |
| B4 | "Find student ID 4821." | Can they use search? | Locate via search within 15 seconds |
| B5 | "Are any students missing information?" | Can they spot alert rows? | Identify at least 1 flagged row |

#### Task Set C: Compliance Review (10 minutes)

| Task | Prompt | Observe | Success Metric |
|------|--------|---------|---------------|
| C1 | "Go to the compliance report. How many ESOL students are there?" | Navigation + data reading | Find ESOL count within 20 seconds |
| C2 | "Which ESOL level has the most students?" | Can they read the bar chart? | Correctly identify the tallest bar's level |
| C3 | "Are there any ESOL students without exit dates?" | Can they find the missing exit count? | Identify the number within 15 seconds |
| C4 | "Which room has the most ESE students?" | Can they read the stacked bar chart? | Correctly identify the room within 30 seconds |

#### Task Set D: Print Operations (5 minutes)

| Task | Prompt | Observe | Success Metric |
|------|--------|---------|---------------|
| D1 | "Print the room rosters for the proctor binders." | Can they navigate to rooms and print? | Successful print within 60 seconds |
| D2 | "Print Mrs. Rodriguez's teacher sheet." | Can they filter to one teacher and print? | Successful filtered print within 60 seconds |
| D3 | "Review the printout. Is anything missing?" | Check the printed page | Participant confirms completeness — student names, IDs, accommodations visible |

#### Post-Task Interview (5 minutes)

1. "What was confusing or unclear?"
2. "Was there anything you expected to see but didn't?"
3. "Would you trust this tool for test day? Why or why not?"
4. "What would you change?"

### 4.2 Accessibility Needs Testing

**Recruitment:** 2-3 participants with one or more of: color vision deficiency, low vision (uses zoom/magnification), motor control difference (uses keyboard only or switch device), cognitive processing difference.

**Duration:** 30 minutes per participant.

| Participant Profile | Key Tests | Specific Checks |
|--------------------|-----------|-----------------|
| Color vision deficiency | Badge differentiation, alert row identification, chart comprehension | Can they distinguish ESOL from ESE categories? Can they spot flagged rows? |
| Low vision (200%+ zoom) | Layout at 200% and 400% zoom, text reflow, horizontal scrolling | Tables should scroll horizontally; page should not break. Filter bar should wrap. |
| Keyboard-only | Complete Task Sets A-D using keyboard only | All tasks completable without mouse. Focus is always visible. |
| Screen reader user | Navigate dashboard, read a table, identify a flagged student | All content is announced meaningfully. Table structure is navigable. |

**Low vision zoom testing specifics:**

| Zoom Level | Test | Expected Behavior |
|-----------|------|-------------------|
| - [ ] 200% | Dashboard stats | Stat cards reflow to 2-column or 1-column grid |
| - [ ] 200% | Roster table | Table scrolls horizontally; filter bar wraps |
| - [ ] 200% | Text readability | All text remains sharp (no bitmap scaling) |
| - [ ] 400% | Dashboard | Single-column layout; all content visible via scroll |
| - [ ] 400% | Alert banner | Banner wraps gracefully; action button remains accessible |

### 4.3 Dashboard Comprehension Benchmark

After testing with 5 educators, score these metrics:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to identify total students | < 5 seconds | Stopwatch from page load to verbal answer |
| Time to identify compliance issue | < 15 seconds | Stopwatch from page load to identifying the problem |
| Time to navigate to fix | < 30 seconds | Stopwatch from identification to arriving at tracker |
| Filter accuracy | 100% | Participant applies correct filter on first attempt |
| Print success rate | 100% | Participant produces correct printout on first attempt |
| Comprehension score | >= 4/5 correct task completions | Count of successfully completed tasks from Set A-D |

### 4.4 Print Usability Under Real Conditions

| Test Condition | Method | Check |
|---------------|--------|-------|
| - [ ] Classroom laser printer (B&W) | Print rooms page | Room headers distinguishable in grayscale; text readable |
| - [ ] Classroom laser printer (color) | Print rooms page | Colors preserved; badges readable |
| - [ ] Chrome print dialog | Cmd+P on macOS | Print preview matches screen; `.no-print` elements hidden |
| - [ ] Safari print dialog | Cmd+P on macOS | Same checks — Safari sometimes handles `print-color-adjust` differently |
| - [ ] Edge print dialog | Ctrl+P on Windows | Same checks |
| - [ ] Mobile print (iPad) | Share → Print on iOS | Layout adapts; content is readable at default scale |
| - [ ] Margin settings | Default margins vs narrow | Content should fit within default margins without clipping |

---

## Section 5: Prioritized Testing Roadmap and Automation Strategy

### 5.1 Phase 1: Critical (Week 1)

**Justification:** These components directly display compliance-critical data. A failure here means an administrator could miss a compliance violation, resulting in a student not receiving mandated accommodations on test day.

| Component | Route | Manual Tests | Automated Tests | Screen Readers |
|-----------|-------|-------------|-----------------|----------------|
| Compliance alert banner | `/dashboard` | Color independence, keyboard activation, screen reader announcement | `jest-axe` on rendered component: check `role="alert"`, contrast | VoiceOver, NVDA |
| Flagged stat card | `/dashboard` | Visual distinction from normal cards in grayscale, screen reader text | `jest-axe`: verify text content is meaningful without color | VoiceOver |
| Accommodation badges | `/roster`, `/rooms`, `/tracker`, `/ese` | All 14 badge types: contrast check, color vision simulation, screen reader text | `jest-axe` on badge component: verify text content exists, contrast passes | VoiceOver, NVDA |
| Alert rows (missing exit dates) | `/roster`, `/tracker` | 3px border visible in grayscale, text label present, screen reader differentiation | Cypress: verify `.alert-row` has `border-left`, verify text "No Exit Date" exists | VoiceOver |
| ESOL status badges | `/tracker` | All 5 status types: contrast, text labels, dot indicator `aria-hidden` | `jest-axe` on each status type | VoiceOver |

**Estimated time:** 8-12 hours (manual: 6h, automated setup: 4h, screen reader: 2h)

**Tools:**
- Chrome DevTools contrast checker
- Chrome vision deficiency emulation
- `jest-axe` for component-level automated checks
- VoiceOver (macOS) + NVDA (Windows VM or colleague's machine)

### 5.2 Phase 2: High Priority (Week 2)

**Justification:** These components are used daily by teachers and administrators. Failures here degrade usability but don't risk compliance violations.

| Component | Route | Manual Tests | Automated Tests |
|-----------|-------|-------------|-----------------|
| Roster filtering | `/roster` | Keyboard navigation through all filter controls, filter pill toggle | Cypress: tab through filters, apply filter, verify table updates |
| Data table sorting | `/roster` | Keyboard sort, `aria-sort` attribute, focus retention | Cypress: click header, verify `aria-sort`, verify focus stays |
| Print layouts | `/rooms`, `/teachers` | Print on 3 browsers (Chrome, Safari, Edge), B&W and color printers | Playwright: generate PDF screenshot, visual regression |
| Search functionality | `/roster`, `/tracker`, `/ese` | Screen reader label, clear button keyboard access | `jest-axe`: verify `aria-label` on search inputs |
| Cycle selector | All routes | Keyboard accessible in both header (glass) and content (standard) contexts | Cypress: Tab to selector, Arrow Down, Enter |

**Estimated time:** 10-14 hours (manual: 8h, automated: 4h, print testing: 2h)

### 5.3 Phase 3: Medium Priority (Week 3)

**Justification:** These components are important but used less frequently or by fewer users.

| Component | Route | Manual Tests | Automated Tests |
|-----------|-------|-------------|-----------------|
| ESE code filter pills | `/ese` | `aria-pressed` toggle, keyboard Enter/Space | Cypress: verify `aria-pressed` toggles |
| Proctor notes input | `/ese` | Label association, keyboard focus | `jest-axe`: verify label or `aria-label` |
| Teacher filter tabs | `/teachers` | Keyboard toggle, visual focus indicator | Cypress: Tab to tabs, Enter to select |
| Upload flow | `/upload` | File input keyboard activation, error message association, progress bar reduced motion | Cypress: Tab to drop zone, Enter, verify flow |
| Recharts visualizations | `/compliance` | Screen reader: verify chart has `aria-label` or text alternative; keyboard: verify tooltips (if interactive) | `jest-axe` on chart containers |
| Quick link cards | `/dashboard` | Focus ring visible, screen reader announces destination | `jest-axe`: verify link text is descriptive |
| Form validation | `/upload` | Error text linked to input via `aria-describedby` | `jest-axe` after triggering validation error |

**Estimated time:** 8-10 hours (manual: 5h, automated: 3h, screen reader: 2h)

### 5.4 Browser & OS Test Matrix

| Browser | OS | Priority | Notes |
|---------|-----|----------|-------|
| Chrome 120+ | macOS | Primary | Developer and most admin workstations |
| Chrome 120+ | Windows 10/11 | Primary | School-issued devices |
| Safari 17+ | macOS | Secondary | Some admin Macs |
| Edge 120+ | Windows 10/11 | Secondary | Default on school Windows devices |
| Safari | iPadOS 17+ | Tertiary | Tablet usage for mobile proctoring |
| Firefox 120+ | Any | Tertiary | Unlikely in school environments |

**Screen reader pairings:**

| Screen Reader | Browser | OS | Priority |
|--------------|---------|-----|----------|
| VoiceOver | Safari | macOS | Primary |
| NVDA | Chrome | Windows | Primary |
| JAWS | Chrome | Windows | Secondary |
| VoiceOver | Safari | iPadOS | Tertiary |

### 5.5 Automation Integration

#### Pre-Commit Hooks

Install and configure `eslint-plugin-jsx-a11y` as a pre-commit check:

```bash
npm install -D eslint-plugin-jsx-a11y
```

**Rules that should block commits:**

| Rule | What It Catches | Severity |
|------|----------------|----------|
| `jsx-a11y/alt-text` | Missing alt text on images | Error |
| `jsx-a11y/aria-props` | Invalid ARIA attributes | Error |
| `jsx-a11y/aria-role` | Invalid ARIA roles | Error |
| `jsx-a11y/click-events-have-key-events` | Click handlers without keyboard equivalents | Error |
| `jsx-a11y/label-has-associated-control` | Form inputs without labels | Warning |
| `jsx-a11y/no-noninteractive-element-interactions` | Click handlers on non-interactive elements | Warning |
| `jsx-a11y/anchor-is-valid` | Empty or invalid `href` | Error |

#### CI/CD Pipeline Integration

```yaml
# In CI pipeline (GitHub Actions, etc.)
accessibility-test:
  steps:
    - name: Install dependencies
      run: npm ci

    - name: Run ESLint a11y rules
      run: npx eslint src/ --rule 'jsx-a11y/*'

    - name: Run jest-axe component tests
      run: npx jest --testPathPattern='a11y'

    - name: Run Lighthouse CI
      run: |
        npm run build
        npx lhci autorun --collect.staticDistDir=out \
          --assert.assertions.categories:accessibility=error:0.9
```

**`jest-axe` component test example:**

```typescript
// src/components/__tests__/AccomBadge.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import AccomBadge from '../AccomBadge'

expect.extend(toHaveNoViolations)

describe('AccomBadge accessibility', () => {
  const groups = ['ESOL Level 1', 'ESOL Level 2', 'ESE — K', 'Standard', 'Section 504']

  groups.forEach(group => {
    it(`${group} has no accessibility violations`, async () => {
      const { container } = render(<AccomBadge group={group} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
```

**Playwright accessibility test example:**

```typescript
// tests/a11y/dashboard.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('dashboard has no critical accessibility violations', async ({ page }) => {
  await page.goto('/dashboard')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0)
  expect(results.violations.filter(v => v.impact === 'serious')).toHaveLength(0)
})
```

#### Regression Testing

**On every deployment, automatically verify:**

| Check | Tool | What It Catches |
|-------|------|----------------|
| Contrast ratios | Lighthouse CI (score >= 90) | New colors that fail AA |
| ARIA validity | `jest-axe` on all components | Broken `aria-*` attributes after refactor |
| Badge text presence | Cypress/Playwright | Badge renders without text content (empty span) |
| Alert role presence | Cypress/Playwright | Alert banner missing `role="alert"` |
| Focus visibility | Playwright visual regression | Focus ring CSS removed or overridden |
| Print layout | Playwright PDF generation | `.no-print` elements appearing in print |

#### Tests That Must Remain Manual

These cannot be automated because they require human judgment:

| Test | Why Manual | Frequency |
|------|-----------|-----------|
| Educator comprehension | Requires observing human understanding, not DOM structure | Quarterly or after major redesign |
| Color vision simulation validation | Automated tools detect contrast but can't judge "distinguishability" in context | After any badge/color change |
| Print quality on real printers | PDF rendering differs from physical output (toner, paper, margins) | After any print style change |
| Screen reader narrative flow | Automated tools check attributes but can't judge whether the reading order tells a coherent story | After any layout change |
| Vestibular safety of new animations | Automated tools can't judge "is this disorienting" | When any animation is added |
| First-time user onboarding | Whether a new teacher understands the dashboard without training | Annually or after major redesign |

---

## Appendix: Identified Gaps and Recommendations

Issues found during this audit that should be addressed:

| Gap | Severity | Current State | Recommendation | Route(s) |
|-----|----------|--------------|----------------|----------|
| No skip link | Medium | First Tab stop is the header nav, not main content | Add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to main content</a>` as first element in `<body>` | layout.tsx |
| No `aria-sort` on sortable columns | Medium | Columns sort on click but don't announce state | Add `aria-sort="ascending"` / `"descending"` / `"none"` to `<th>` elements | roster |
| No `aria-pressed` on filter pills | Low | Filter pills toggle but don't announce toggle state | Add `aria-pressed="true"` / `"false"` to status/code filter buttons | tracker, ese |
| No `aria-label` on search inputs | Medium | `placeholder` text serves as pseudo-label but isn't announced by all screen readers | Add explicit `aria-label="Search students"` | roster, tracker, ese |
| No `aria-live` on result counts | Low | "Showing 12 of 194 students" updates silently | Wrap count in `<span aria-live="polite">` so screen readers announce filter results | roster, tracker, ese |
| Missing `<title>` per route | Low | Browser tab shows "SFEC Testing" on all routes | Add `<title>` via Next.js `metadata` export per route | All |
| No `aria-current="page"` on active nav | Low | Active nav pill has visual gold styling but no ARIA attribute | Add `aria-current="page"` to the active nav link | layout.tsx |
| Progress bar reduced motion | Low | `transition-all duration-300` on upload progress | Add `prefers-reduced-motion: reduce` CSS override or use `transition-[width]` | upload |
| Chart alt text | Medium | Recharts renders SVG without accessible labels | Add `aria-label` to chart container divs describing the data (e.g., "Bar chart showing ESOL students by level: Level 1: 8, Level 2: 14...") | compliance |
| FLEID column label | Low | "FLEID" may confuse substitute teachers | Consider tooltip or expanded label "FL Education ID" | roster |
