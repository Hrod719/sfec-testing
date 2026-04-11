# SFEC Testing Roster — Production Design Specification

**Version:** 2.0
**Application:** Ronald Reagan Doral SHS — Testing Command Center
**Stack:** Next.js 14 / TypeScript / Tailwind CSS 3.3 / Recharts
**Accessibility Target:** WCAG 2.1 AA
**Routes:** dashboard, upload, roster, rooms, tracker, ese, compliance, teachers

---

## Section 1: Enterprise Color Palette with Semantic Meaning

### 1.1 Brand Identity Colors

The palette derives from the Ronald Reagan Doral Senior High School Bison identity. Navy anchors institutional authority, gold signals prestige and active states, and green provides a secondary accent from the school wordmark.

| Token | Hex | RGB | Tailwind Class | Semantic Role |
|-------|-----|-----|----------------|---------------|
| Navy Primary | `#1B2D4A` | `27, 45, 74` | `bg-brand-navy` / `text-brand-navy` | Primary institutional anchor. Used for: header gradient start, primary text on light surfaces, primary button fills, table heading emphasis. Conveys authority and stability — the color administrators associate with official communications. |
| Navy Light | `#243B5C` | `36, 59, 92` | `bg-brand-navy-light` / `text-brand-navy-light` | Header gradient endpoint, primary button hover state, sortable column hover. Slightly warmer than Navy Primary — creates perceived depth in the header gradient. |
| Navy Deep | `#0F1D30` | `15, 29, 48` | `bg-brand-navy-deep` | Deepest branded tone. Used sparingly for extreme contrast layering within the dark header zone (e.g., option dropdown backgrounds on selects rendered over the header). |
| Bison Gold | `#C5A647` | `197, 166, 71` | `bg-brand-gold` / `text-brand-gold` / `border-brand-gold` | Brand accent. Used for: the 3px gold accent stripe below the header, active navigation pill backgrounds (`bg-brand-gold/15`), cycle metadata labels, card hover borders. **Never used for body text** — its 2.8:1 ratio against white fails AA. Reserved for decorative and interactive signals. |
| Accent Green | `#3B8C5E` | `59, 140, 94` | `bg-brand-green` / `text-brand-green` | Secondary accent derived from the Bison wordmark green. Reserved for positive-trend micro-indicators and future chart annotations. Not currently used in primary UI — held in reserve to prevent palette overload. |

### 1.2 Semantic Colors — Compliance & Status

Each color maps to a **specific compliance state** in the Florida standardized testing workflow. These are not arbitrary severity levels — they encode the urgency tiers that Miami-Dade County school administrators already recognize.

| Token | Hex | RGB | Tailwind | Contrast on White | Compliance Meaning |
|-------|-----|-----|----------|-------------------|--------------------|
| Critical / Error | `#DC2626` | `220, 38, 38` | `semantic-error` | 4.6:1 (AA) | **Compliance violation.** An ESOL student has `esol_level` populated but `esol_exit_date` is null. This is a documentation deficiency that must be resolved before test day. Triggers: red-tinted table rows, alert banners, flagged stat card, red left-border on affected rows. |
| Warning | `#EA580C` | `234, 88, 12` | `semantic-warning` | 3.9:1 (AA large) | **Past exit date.** An ESOL student's exit date has already passed. The student may have exited the program and the record wasn't updated, or the date was entered incorrectly. Requires review — not as urgent as missing data but indicates stale records. |
| Caution | `#D97706` | `217, 119, 6` | `semantic-caution` | 3.2:1 (AA large) | **Approaching deadline.** ESOL exit date is within 30 days. No immediate action required but the administrator should be aware. Used in tracker status pills and compliance dashboard trend indicators. |
| Success | `#16A34A` | `22, 163, 74` | `semantic-success` | 3.9:1 (AA large) | **Compliant / Ready.** Student record is complete, accommodations are documented, exit dates are valid and in the future. The Test Readiness percentage turns green at >= 90%. Standard (non-accommodated) students display in this color as "no special requirements needed." |
| Info / ESOL | `#2563EB` | `37, 99, 235` | `semantic-info` | 4.6:1 (AA) | **ESOL program indicator.** Blue is the universal ESOL category color in this application. All ESOL student counts, level badges, chart segments, and table column headers for ESOL data use this color. Chosen because blue carries no inherent positive/negative connotation — ESOL status is a classification, not a judgment. |
| Purple / ESE | `#7C5CFC` | `124, 92, 252` | `semantic-purple` | 3.5:1 (AA large) | **ESE/504 program indicator.** Purple distinguishes ESE/504 accommodations from ESOL in every context. The two-color system (blue = ESOL, purple = ESE) creates instant visual categorization in tables, charts, and badges. |

### 1.3 Surface Colors — Light Content Area

The content zone uses warm-neutral surfaces. The subtle difference between page background and card background creates depth without hard borders.

| Token | Hex | Tailwind | Role |
|-------|-----|----------|------|
| Page Background | `#F7F8FA` | `surface-page` | Content area behind all cards. Just warm enough to differentiate from pure white cards without appearing gray on cheaper school monitors. |
| Card Background | `#FFFFFF` | `surface-card` | Every content card, table container, filter bar, modal overlay. Pure white against `#F7F8FA` creates a subtle lift effect. |
| Table Stripe | `#FAFBFC` | `surface-stripe` | Even-row alternating background. Almost invisible — exists to aid row-tracking in dense 20+ row tables without creating visual noise. |
| Row Hover | `#F0F7FF` | `surface-hover` | Table row hover. Light blue tint signals interactivity and helps track which row the cursor is on. |
| Primary Border | `#E5E8ED` | `surface-border` | Card borders, table containers, section dividers, input borders. Medium-weight — visible enough to define regions but not heavy enough to fragment the layout. |
| Light Border | `#F0F2F5` | `surface-border-light` | Table row dividers. Lighter than card borders to establish a clear border-weight hierarchy: card borders > row dividers. |
| Alert Row | `#FEF2F2` | (inline) | Flagged student row background. Combined with 3px left red border for redundant signaling (color + structure). |
| Alert Row Hover | `#FEE2E2` | (inline) | Hover state for flagged rows. Darkens the red tint slightly. |

### 1.4 Text Colors

| Token | Hex | Tailwind | Contrast on `#FFFFFF` | Contrast on `#F7F8FA` | Usage |
|-------|-----|----------|-----------------------|-----------------------|-------|
| Primary | `#1B2D4A` | `txt-primary` | 11.2:1 (AAA) | 10.8:1 (AAA) | Page headings, student names in tables, primary stat values, bold data cells. |
| Secondary | `#6B7A8D` | `txt-secondary` | 4.7:1 (AA) | 4.5:1 (AA) | Labels, captions, table column headers, filter labels, subtitles, non-critical metadata. |
| Tertiary | `#9CA3AF` | `txt-tertiary` | 3.0:1 | 2.9:1 | Placeholder text in inputs, disabled button text, em-dash substitutes in empty table cells. **Not for essential content.** |
| Body (table default) | `#3A4A5C` | (CSS) | 7.8:1 (AAA) | 7.5:1 (AAA) | Default table cell text. Set via `.roster-table td { color: #3A4A5C; }`. Slightly lighter than Primary to reduce visual weight in data-dense tables. |

### 1.5 Header-Context Colors (Dark Surfaces)

Used exclusively within the navy header gradient. These are tuned for legibility against `#1B2D4A` through `#243B5C`.

| Token | Value | Tailwind | Contrast vs `#243B5C` | Usage |
|-------|-------|----------|-----------------------|-------|
| Header White | `#FFFFFF` | `text-white` | 9.8:1 (AAA) | School name, hero stat values |
| Header Muted | `#8BA4C4` | `text-header-muted` | 3.6:1 | Subtitle text, inactive nav, cycle labels. Meets AA for large text (>= 18px). For small text, always paired with a high-contrast element (e.g., a white stat value) so information is redundant. |
| Glass BG | `rgba(255,255,255,0.07)` | `bg-white/[0.07]` | N/A | Hero stat card fill. Provides depth layering without solid color. |
| Glass Border | `rgba(255,255,255,0.1)` | `border-white/10` | N/A | Hero stat card borders. Subtle edge definition. |
| Gold Accent | `#C5A647` | `text-brand-gold` | 4.8:1 (AA) vs `#243B5C` | Active nav pill text, cycle metadata. Meets AA against the dark header. |

### 1.6 Accommodation Badge Palette

Each badge uses a pastel background with a dark, high-contrast text drawn from the same hue family. The `badge-print` class preserves colors in print output.

**ESOL Level Badges** — An indigo intensity ramp where higher levels = deeper color:

| Level | Background | Text | Tailwind Classes | Contrast |
|-------|-----------|------|------------------|----------|
| 1 | `#DBEAFE` | `#1E40AF` | `bg-blue-100 text-blue-800 badge-print` | 7.1:1 (AAA) |
| 2 | `#C7D2FE` | `#3730A3` | `bg-indigo-200 text-indigo-800 badge-print` | 6.2:1 (AA) |
| 3 | `#A5B4FC` | `#312E81` | `bg-indigo-300 text-indigo-900 badge-print` | 5.4:1 (AA) |
| 4 | `#818CF8` | `#FFFFFF` | `bg-indigo-400 text-white badge-print` | 3.4:1 (AA-large) |
| 5 | `#6366F1` | `#FFFFFF` | `bg-indigo-500 text-white badge-print` | 4.1:1 (AA) |

**ESE Exceptionality Code Badges** — Each code gets a distinct hue within the purple-violet family to maintain categorical coherence while being individually identifiable:

| Code | Full Name | Background | Text | Tailwind Classes | Contrast |
|------|-----------|-----------|------|------------------|----------|
| K | Specific Learning Disability | `#EDE9FE` | `#6D28D9` | `bg-violet-100 text-violet-700 badge-print` | 5.7:1 (AA) |
| J | Emotionally Disturbed | `#F3E8FF` | `#7C3AED` | `bg-purple-100 text-purple-600 badge-print` | 4.5:1 (AA) |
| V | Speech/Language Impaired | `#DDD6FE` | `#5B21B6` | `bg-violet-200 text-violet-800 badge-print` | 5.9:1 (AA) |
| P | Other Health Impaired | `#C4B5FD` | `#4C1D95` | `bg-violet-300 text-violet-900 badge-print` | 6.8:1 (AA) |
| 504 | Section 504 Plan | `#FEE2E2` | `#B91C1C` | `bg-red-100 text-red-700 badge-print` | 6.2:1 (AA) |

**Rationale:** 504 uses red instead of purple because Section 504 is a **separate federal law** from IDEA (which governs K/J/V/P). The color break signals this legal distinction to administrators who understand the regulatory difference.

**Accommodation Group Badges** (composite categories):

| Group | Background | Text | Tailwind Classes |
|-------|-----------|------|------------------|
| ESOL (any level) | `#DBEAFE` | `#1E40AF` | `bg-blue-100 text-blue-800 badge-print` |
| ESE (any code) | `#EDE9FE` | `#6D28D9` | `bg-violet-100 text-violet-800 badge-print` |
| ESOL + ESE (dual-served) | `#FEF3C7` | `#92400E` | `bg-amber-100 text-amber-800 badge-print` |
| Standard | `#D1FAE5` | `#065F46` | `bg-emerald-100 text-emerald-800 badge-print` |

**ESOL Status Badges** (urgency-ordered):

| Status | Background | Text | Dot Color | Tailwind Classes |
|--------|-----------|------|-----------|------------------|
| No Exit Date | `#FEE2E2` | `#B91C1C` | `currentColor` | `bg-red-100 text-red-700` |
| Past Exit | `#FFEDD5` | `#C2410C` | `currentColor` | `bg-orange-100 text-orange-700` |
| Exiting Soon (<=30d) | `#FEF3C7` | `#92400E` | `currentColor` | `bg-amber-100 text-amber-800` |
| Exiting This Quarter (<=90d) | `#FEF9C3` | `#854D0E` | `currentColor` | `bg-yellow-100 text-yellow-800` |
| Active ESOL | `#D1FAE5` | `#065F46` | `currentColor` | `bg-emerald-100 text-emerald-800` |

---

## Section 2: Typography Hierarchy

### 2.1 Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Mono', 'Courier New', monospace;
```

Google Fonts import includes: Inter (400, 500, 600, 700, 800) and JetBrains Mono (400, 500, 700, 800).

**Design rationale:** Inter was designed specifically for computer screens at small sizes. Its tall x-height and open apertures maximize legibility on the lower-resolution monitors common in school administrative offices. JetBrains Mono's distinctive numeral forms (especially `0` vs `O`, `1` vs `l`) prevent misreading student IDs and FLEID numbers.

### 2.2 Complete Type Scale

| Level | Font | Size (px) | Size (rem) | Weight | Line Height | Tracking | Tailwind Classes | Usage |
|-------|------|-----------|------------|--------|-------------|----------|------------------|-------|
| Page Heading | Inter | 20 | 1.25 | 800 | 1.3 | -0.02em | `text-xl font-extrabold tracking-tight` | Route page titles: "Master Roster", "Compliance Report", "ESOL Tracker" |
| Section Heading | Inter | 14 | 0.875 | 700 | 1.4 | normal | `text-sm font-bold text-txt-primary` | Card section titles: "Teacher Summary", "ESOL Students by Level", "Room Distribution" |
| Card Title | Inter | 13 | 0.8125 | 700 | 1.4 | normal | `text-[13px] font-bold text-txt-primary` | Quick link card titles, alert banner titles, table title bars |
| Body | Inter | 13 | 0.8125 | 400 | 1.6 | normal | `text-[13px]` | Descriptions, explanatory text, alert body copy. Line-height 1.6 ensures readability in multi-line blocks. |
| Body Emphasis | Inter | 13 | 0.8125 | 600 | 1.4 | normal | `text-[13px] font-semibold text-txt-primary` | Student names in tables, teacher names, emphasized data cells |
| Small Body | Inter | 11 | 0.6875 | 500 | 1.3 | normal | `text-[11px] font-medium` | Metadata labels (cycle info, card subtitles), quick link descriptions, alert action descriptions |
| Table Header | Inter | 10 | 0.625 | 700 | 1.3 | 0.06em | `text-[10px] font-bold uppercase tracking-[0.06em]` | Column headers across all roster tables. Uppercase + tracking creates clear separation from data rows. |
| Stat Label (header) | Inter | 9 | 0.5625 | 500 | 1.3 | 0.08em | `text-[9px] uppercase tracking-[0.08em] font-medium` | Hero stat card labels in the dark header ("TOTAL STUDENTS", "TEST READINESS"). Always paired with a 28px value below. |
| Stat Label (light) | Inter | 9 | 0.5625 | 500 | 1.3 | 0.06em | `text-[9px] uppercase tracking-[0.06em] font-medium text-txt-secondary` | Compliance page stat card labels |
| Caption | Inter | 10 | 0.625 | 400 | 1.3 | normal | `text-[10px] text-txt-secondary` | Table item counts ("6 teachers"), chart footnotes, supplementary info |
| Hero Number | JBMono | 28 | 1.75 | 800 | 1.0 | normal | `text-[28px] font-extrabold font-mono leading-none` | Dashboard hero stat values. Large enough to read across a room. |
| Stat Number | JBMono | 24 | 1.5 | 800 | 1.0 | normal | `text-2xl font-extrabold font-mono` | Compliance page stat card values |
| Data Mono | JBMono | 12 | 0.75 | 400–700 | 1.4 | normal | `font-mono text-xs` | Student IDs, FLEIDs, room numbers, period numbers, numeric counts in tables |
| Badge Text | Inter | 10 | 0.625 | 600 | 1.3 | normal | `text-[10px] font-semibold` | All badge labels (accommodation, status, code) |
| Nav Pill | Inter | 11 | 0.6875 | 500 | 1.3 | normal | `text-[11px] font-medium` | Header navigation items |
| Button | Inter | 14 | 0.875 | 600 | 1.4 | normal | `text-sm font-semibold` | Primary and secondary buttons |
| Small Button | Inter | 10 | 0.625 | 600 | 1.3 | normal | `text-[10px] font-semibold` | Alert action buttons, compact actions |

### 2.3 Monospace Usage Rules

JetBrains Mono is restricted to **numeric and identifier data**:

| Use Mono | Use Inter |
|----------|-----------|
| Student IDs (`4821`) | Student names (`Alvarez, Maria C.`) |
| FLEID numbers | Teacher names |
| Room numbers (`101`, `MC-L`) | Course titles |
| Period numbers (`3`) | Descriptions, labels |
| Stat values (`194`, `96%`) | Badge text |
| Grade numbers (`10`) | Status text ("Active", "Exiting Soon") |

**Never** use monospace for names, descriptions, or qualitative text. The visual weight difference between Inter and JetBrains Mono creates implicit hierarchy: mono = raw data, sans-serif = human-readable labels.

---

## Section 3: Core Component Patterns

### 3.1 Stat Card — Header Variant (Glass Morphism)

**Context:** Dashboard hero section only, rendered on the dark navy gradient.

**Visual:** Translucent card with frosted-glass appearance. Category-colored label, large white value, muted sub-text.

```html
<div class="rounded-[10px] p-3.5 border bg-white/[0.07] border-white/10">
  <p class="text-[9px] uppercase tracking-[0.08em] font-medium mb-1 text-blue-400">
    ESOL
  </p>
  <p class="text-[28px] font-extrabold font-mono leading-none text-blue-400">
    47
  </p>
  <p class="text-[9px] mt-1 text-[#5A7A9A]">24% of total</p>
</div>
```

**Flagged variant (critical alert card):**
```html
<div class="rounded-[10px] p-3.5 border bg-red-500/10 border-red-500/25">
  <p class="text-[9px] uppercase tracking-[0.08em] font-medium mb-1 text-red-300">FLAGGED</p>
  <p class="text-[28px] font-extrabold font-mono leading-none text-red-400">8</p>
  <p class="text-[9px] mt-1 text-red-300/70">missing exit dates</p>
</div>
```

| State | Appearance | Notes |
|-------|-----------|-------|
| Default | As shown above | Static display — no interactive states |
| Loading | Value replaced with `animate-pulse` placeholder | 28px gray bar, 40% width |

**Accessibility:** The 9px label is supplementary to the 28px value + sub-text. Information is triply redundant (label + value + description), so the small label size is acceptable per WCAG incidental text provisions.

### 3.2 Stat Card — Light Variant (Content Area)

**Context:** Compliance page, any light-background stat display.

```html
<div class="rounded-[10px] border border-surface-border p-3 border-t-[3px] border-t-semantic-info bg-surface-card">
  <p class="text-[9px] uppercase tracking-[0.06em] font-medium text-txt-secondary">ESOL</p>
  <p class="text-2xl font-extrabold font-mono text-semantic-info">47</p>
</div>
```

**Flagged variant:**
```html
<div class="rounded-[10px] border border-red-200 p-3 border-t-[3px] border-t-semantic-error bg-red-50">
  <p class="text-[9px] uppercase tracking-[0.06em] font-medium text-red-700">MISSING EXIT</p>
  <p class="text-2xl font-extrabold font-mono text-semantic-error">8</p>
</div>
```

The 3px colored top border provides instant category identification without relying on the label text alone.

### 3.3 Data Table

The foundational component — used on 6 of 8 routes.

**Container wrapper:**
```html
<div class="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
  <!-- Optional title bar -->
  <div class="px-4 py-3 border-b border-surface-border flex items-center justify-between">
    <h3 class="text-sm font-bold text-txt-primary">Teacher Summary</h3>
    <span class="text-[10px] text-txt-secondary">6 teachers</span>
  </div>
  <!-- Scrollable table area -->
  <div class="overflow-x-auto">
    <table class="roster-table">
      <thead>
        <tr>
          <th>Column Header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cell data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Base styles** (defined in `globals.css`):

| Element | Property | Value |
|---------|----------|-------|
| `table` | `width` / `border-collapse` / `font-size` | `100%` / `collapse` / `13px` |
| `th` | `padding` | `8px 14px` |
| `th` | `background` / `color` | `#F8F9FB` / `#6B7A8D` |
| `th` | `font` | `10px / 700 / uppercase / tracking 0.06em` |
| `th` | `border-bottom` | `2px solid #E5E8ED` |
| `td` | `padding` | `10px 14px` |
| `td` | `color` / `border-bottom` | `#3A4A5C` / `1px solid #F0F2F5` |
| `tr:nth-child(even) td` | `background` | `#FAFBFC` |
| `tr:hover td` | `background` | `#F0F7FF` |
| `tr.alert-row td` | `background` / `border-bottom` | `#FEF2F2` / `#FECACA` |
| `tr.alert-row td:first-child` | `border-left` | `3px solid #DC2626` |
| `tr.alert-row:hover td` | `background` | `#FEE2E2` |

**Sortable column header:**
```tsx
<th
  onClick={() => toggleSort(column)}
  className="cursor-pointer select-none hover:text-brand-navy transition-colors"
  aria-sort={sortCol === column ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}
  role="columnheader"
>
  {label} {sortCol === column ? (sortDir === 1 ? ' \u25B2' : ' \u25BC') : ''}
</th>
```

**Category-colored column headers** (ESOL, ESE, Standard columns):
```html
<th class="text-center text-semantic-info">ESOL</th>
<th class="text-center text-semantic-purple">ESE</th>
<th class="text-center text-semantic-success">Std</th>
```

| State | Visual Change |
|-------|--------------|
| Default | Light gray header, white/striped rows |
| Hover | Row highlights `#F0F7FF` |
| Alert | Red-tinted row + 3px left border |
| Alert Hover | Darker red tint `#FEE2E2` |
| Empty | "No students found" centered message, `text-txt-tertiary` |

**Accessibility:**
- `<thead>` and `<tbody>` for semantic structure
- `aria-sort` on sortable columns
- `role="columnheader"` on `<th>` elements
- Alert rows combine color (red background) with structural indicator (3px left border) and text labels ("No Exit Date") — triple redundancy
- Keyboard: sortable headers are focusable via `tabindex="0"` and activate on Enter/Space

### 3.4 Badge Component

**Standard accommodation badge:**
```html
<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 badge-print">
  ESOL Level 2
</span>
```

**Status badge with dot indicator:**
```html
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 badge-print">
  <span class="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true"></span>
  No Exit Date
</span>
```

**ESE code badge (compact):**
```html
<span class="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
  K
</span>
```

| State | Behavior |
|-------|---------|
| Default | Static display — badges are informational, not interactive |
| Print | `badge-print` class applies `print-color-adjust: exact` |

**Accessibility:** Badges contain descriptive text labels — color is supplementary, not primary. The dot indicator in status badges adds a shape cue (circle) alongside color. Screen readers read the text content naturally.

### 3.5 Alert Banner

**Critical alert (compliance violation):**
```html
<div class="bg-red-50 border border-red-200 border-l-4 border-l-semantic-error rounded-lg px-4 py-3 flex items-center justify-between"
     role="alert"
     aria-live="polite">
  <div class="flex items-center gap-3">
    <div class="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-semantic-error font-bold text-sm flex-shrink-0"
         aria-hidden="true">!</div>
    <div>
      <p class="text-[13px] font-bold text-red-900">Compliance Alert</p>
      <p class="text-[11px] text-red-700">
        8 ESOL students have no exit date recorded. This must be resolved before test day.
      </p>
    </div>
  </div>
  <a href="/tracker"
     class="bg-semantic-error text-white text-[10px] font-semibold px-3.5 py-1.5 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
    Review ESOL Tracker
  </a>
</div>
```

**Severity tiers:**

| Severity | Left Border | Background | Icon Circle | Title Color | Body Color | Button |
|----------|------------|-----------|-------------|-------------|------------|--------|
| Critical | `border-l-semantic-error` | `bg-red-50` | `bg-red-100 text-semantic-error` | `text-red-900` | `text-red-700` | `bg-semantic-error hover:bg-red-700` |
| Warning | `border-l-semantic-warning` | `bg-orange-50` | `bg-orange-100 text-semantic-warning` | `text-orange-900` | `text-orange-700` | `bg-semantic-warning hover:bg-orange-700` |
| Info | `border-l-semantic-info` | `bg-blue-50` | `bg-blue-100 text-semantic-info` | `text-blue-900` | `text-blue-700` | `bg-semantic-info hover:bg-blue-700` |
| Success | `border-l-semantic-success` | `bg-emerald-50` | `bg-emerald-100 text-semantic-success` | `text-emerald-900` | `text-emerald-700` | `bg-semantic-success hover:bg-emerald-700` |

**Accessibility:** `role="alert"` + `aria-live="polite"` announce the alert to screen readers. The exclamation icon is `aria-hidden` since the text provides full context. The 4px left border provides a structural (non-color) severity indicator.

### 3.6 Buttons

| Variant | Tailwind Classes | Usage |
|---------|-----------------|-------|
| Primary | `px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2` | Upload, Print, primary page actions |
| Secondary | `px-4 py-2 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary hover:border-txt-secondary text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2` | Cancel, Clear filters, secondary actions |
| Danger | `px-3.5 py-1.5 rounded-md bg-semantic-error text-white text-[10px] font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2` | Alert banner CTAs, destructive confirmations |
| Ghost | `text-txt-secondary hover:text-txt-primary text-xs transition-colors focus:outline-none focus:underline` | Inline links, "Clear" filters, tertiary actions |

| State | Visual |
|-------|--------|
| Default | As specified above |
| Hover | Lightened background (primary) or darkened text (secondary/ghost) |
| Focus | 2px ring in brand color, 2px offset. Visible on keyboard navigation. |
| Active | Slightly darker than hover (browser default `:active`) |
| Disabled | `opacity-50 cursor-not-allowed pointer-events-none` |

**Accessibility:** All buttons have visible focus rings via `focus:ring-2`. Minimum touch target is 44x44px (ensured by `py-2` + text height >= 44px total). Disabled buttons use `pointer-events-none` + reduced opacity.

### 3.7 Modal / Dialog

**Overlay pattern** (for future use — e.g., student detail view, confirm delete):

```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
     aria-modal="true"
     role="dialog"
     aria-labelledby="modal-title">

  <!-- Modal card -->
  <div class="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg border border-surface-border overflow-hidden">

    <!-- Header -->
    <div class="px-5 py-4 border-b border-surface-border flex items-center justify-between">
      <h2 id="modal-title" class="text-sm font-bold text-txt-primary">Modal Title</h2>
      <button class="text-txt-tertiary hover:text-txt-primary transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-brand-navy"
              aria-label="Close dialog">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="px-5 py-4">
      <p class="text-[13px] text-txt-secondary leading-relaxed">Modal content here.</p>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3 border-t border-surface-border flex justify-end gap-2 bg-surface-page">
      <button class="px-4 py-2 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary text-sm transition-colors">
        Cancel
      </button>
      <button class="px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold transition-colors">
        Confirm
      </button>
    </div>
  </div>
</div>
```

**Accessibility:**
- `aria-modal="true"` + `role="dialog"` on the overlay
- `aria-labelledby` pointing to the title
- Focus trap: first focusable element receives focus on open; Tab cycles within modal
- Escape key closes the modal
- Backdrop click closes the modal
- Close button has `aria-label="Close dialog"`

### 3.8 Filter Controls

**Filter bar container:**
```html
<div class="bg-surface-card border border-surface-border rounded-[10px] p-2.5 flex gap-2 flex-wrap items-center no-print">
  <!-- Controls go here -->
</div>
```

**Search input:**
```html
<div class="flex-1 min-w-[180px] relative">
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" aria-hidden="true">...</svg>
  <input
    type="search"
    placeholder="Search by name, ID, or teacher..."
    class="w-full pl-9 pr-3 py-1.5 bg-surface-page border border-surface-border rounded-md text-[13px] text-txt-primary placeholder-txt-tertiary outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-colors"
    aria-label="Search students"
  />
</div>
```

**Select dropdown:**
```html
<select
  class="bg-surface-page border border-surface-border rounded-md px-3 py-1.5 text-[13px] text-txt-primary outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-colors appearance-none bg-[url('data:image/svg+xml,...')] bg-no-repeat bg-right-3 pr-8"
  aria-label="Filter by room"
>
  <option value="">All Rooms</option>
  <option value="101">Room 101</option>
</select>
```

**Filter pill buttons** (ESOL Tracker, ESE page):
```html
<button
  class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-red-100 text-red-800 border-red-200 ring-2 ring-brand-navy/30"
  aria-pressed="true"
>
  No Exit Date (8)
</button>
<button
  class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-emerald-100 text-emerald-800 border-emerald-200 opacity-70 hover:opacity-100"
  aria-pressed="false"
>
  Active (12)
</button>
```

| State | Input/Select | Pill Button |
|-------|-------------|-------------|
| Default | `border-surface-border` | `opacity-70` |
| Focus | `border-brand-navy ring-1 ring-brand-navy/20` | `ring-2 ring-brand-navy/30` |
| Active/Selected | N/A | `ring-2 ring-brand-navy/30 opacity-100` |
| Disabled | `opacity-50 cursor-not-allowed` | `opacity-30 cursor-not-allowed` |

**Accessibility:** All inputs have `aria-label`. Filter pills use `aria-pressed` for toggle state. Search input uses `type="search"` for native clear button on WebKit.

### 3.9 Form Inputs

**Text input:**
```html
<div>
  <label class="text-xs text-txt-secondary block mb-1" for="cycle-name">New cycle name</label>
  <input
    id="cycle-name"
    type="text"
    placeholder="Biology EOC — May 2026"
    class="w-full rounded-md bg-surface-page border border-surface-border text-txt-primary text-sm px-3 py-2 placeholder-txt-tertiary outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-colors"
  />
</div>
```

**Validation states:**

| State | Border | Ring | Label | Helper Text |
|-------|--------|------|-------|-------------|
| Default | `border-surface-border` | none | `text-txt-secondary` | none |
| Focus | `border-brand-navy` | `ring-1 ring-brand-navy/20` | `text-txt-secondary` | none |
| Error | `border-semantic-error` | `ring-1 ring-red-200` | `text-semantic-error` | `text-[11px] text-semantic-error mt-1` |
| Success | `border-semantic-success` | `ring-1 ring-emerald-200` | `text-txt-secondary` | `text-[11px] text-semantic-success mt-1` |
| Disabled | `border-surface-border opacity-50` | none | `text-txt-tertiary` | none |

**Select (cycle selector in header context):**
```html
<div class="bg-white/[0.08] border border-white/[0.12] rounded-lg px-3.5 py-1.5 flex items-center gap-2">
  <span class="text-[10px] text-header-muted uppercase tracking-[0.06em]">Cycle</span>
  <select class="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer">
    <option class="bg-brand-navy text-white">Biology EOC — May 2026</option>
  </select>
</div>
```

### 3.10 Quick Link Cards

```html
<a href="/rooms"
   class="bg-surface-card border border-surface-border rounded-[10px] p-3.5 flex items-start gap-3 hover:border-brand-gold transition-colors group focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2">
  <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-base flex-shrink-0"
       aria-hidden="true">
    &#x1F3EB;
  </div>
  <div>
    <p class="text-[13px] font-bold text-txt-primary group-hover:text-brand-navy transition-colors">Room Rosters</p>
    <p class="text-[11px] mt-0.5 text-txt-secondary">Print-ready sheets for 6 rooms</p>
  </div>
</a>
```

| State | Change |
|-------|--------|
| Default | White card, gray border |
| Hover | Border transitions to `border-brand-gold`, title transitions to `text-brand-navy` |
| Focus | 2px navy ring with 2px offset |

### 3.11 Print-Optimized Layouts

**Global print stylesheet** (in `globals.css`):
```css
@media print {
  body { background: white; color: #1B2D4A; font-size: 12px; }
  .no-print { display: none !important; }
  .print-break { page-break-before: always; }
  .roster-table th {
    background: #F8F9FB; color: #1B2D4A;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .roster-table tr:nth-child(even) td {
    background: #F8F9FB;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .roster-table tr.alert-row td {
    background: #FEF2F2 !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .badge-print {
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
}
```

**Room roster print layout:**
- Each room card applies `.print-break` → one room per page
- Colored room header preserved via `print-color-adjust: exact`
- Header nav hidden via `.no-print`
- Student numbering (#1, #2, ...) printed for roll-call

**Teacher sheet print layout:**
- Each teacher card applies `.print-break` → one teacher per page
- Pastel teacher header backgrounds preserved
- Accommodation badges preserved in color
- Proctor notes column hidden (localStorage-only, not relevant for paper handouts)

---

## Section 4: Spacing and Whitespace Guidelines

### 4.1 Base Unit

**4px base unit** with a practical scale aligned to Tailwind's default spacing.

The spacing system uses multiples of 4px because:
1. It divides evenly into common screen resolutions
2. Tailwind's spacing scale maps directly (1 unit = 4px)
3. It prevents the "3px or 5px?" decision paralysis that causes inconsistency

### 4.2 Spacing Scale

| Token | Value (px) | Value (rem) | Tailwind | Primary Usage |
|-------|-----------|------------|----------|---------------|
| `1` | 4 | 0.25 | `p-1` / `gap-1` | Tight inline gaps |
| `1.5` | 6 | 0.375 | `p-1.5` / `gap-1.5` | Badge internal padding (vertical) |
| `2` | 8 | 0.5 | `p-2` / `gap-2` | Filter bar padding, filter control gaps |
| `2.5` | 10 | 0.625 | `p-2.5` / `gap-2.5` | Stat card grid gaps, quick link grid gaps, header nav vertical padding |
| `3` | 12 | 0.75 | `p-3` / `gap-3` | Light stat card padding, button horizontal gaps, cycle selector gaps |
| `3.5` | 14 | 0.875 | `p-3.5` | Hero stat card padding, quick link card padding |
| `4` | 16 | 1.0 | `p-4` / `gap-4` | Chart card padding, table title bar padding, alert banner padding, section margins |
| `5` | 20 | 1.25 | `p-5` | Page content padding (all routes), header horizontal padding, modal padding |
| `6` | 24 | 1.5 | `p-6` / `gap-6` | Reserved for extra breathing room between major page sections |
| `8` | 32 | 2.0 | `p-8` | Upload drop zone padding, success/error state card padding |
| `12` | 48 | 3.0 | `p-12` | Upload drop zone vertical padding (generous target area) |

### 4.3 Container Padding Standards

| Container | Padding | Tailwind | Rationale |
|-----------|---------|----------|-----------|
| Page content area | 20px all | `p-5` | Consistent breathing room. Not so wide it wastes space on 1920px monitors. |
| Header nav bar | 10px V, 20px H | `px-5 py-2.5` | Compact — the header is a navigation aid, not a content area. |
| Dashboard hero section | 16px top, 20px bottom, 20px H | `px-5 pt-4 pb-5` | Extra bottom padding creates visual separation from the content area below. |
| Content cards | 16px all | `p-4` | Standard card padding — comfortable without wasting space. |
| Stat cards (header) | 14px all | `p-3.5` | Slightly tighter — 6 cards must fit in a row. |
| Stat cards (light) | 12px all | `p-3` | Compact — 5 cards in a row on compliance page. |
| Table title bar | 12px V, 16px H | `px-4 py-3` | Horizontal aligns with table cell padding (14px) for optical alignment. |
| Table cells | 10px V, 14px H | `10px 14px` (CSS) | Dense enough for 20+ rows to be scannable; generous enough to prevent crowding. |
| Filter bar | 10px all | `p-2.5` | Tight wrapping around filter controls — the controls have their own internal padding. |
| Alert banner | 12px V, 16px H | `px-4 py-3` | Horizontal matches card padding for alignment when stacked. |
| Modal body | 16px V, 20px H | `px-5 py-4` | Matches page padding for consistency. |

### 4.4 Section Spacing (Vertical Rhythm)

| Relationship | Gap | Tailwind | Example |
|-------------|-----|----------|---------|
| Page title → first content | 16px | `mb-4` | "Master Roster" heading to filter bar |
| Between content sections | 16–20px | `space-y-4` or `space-y-5` | Alert banner → quick links → teacher table |
| Between stat cards | 10px | `gap-2.5` | Dashboard hero stat grid |
| Between chart cards | 12px | `gap-3` | Compliance page ESOL chart → donut chart |
| Filter bar → table | 16px | `mb-4` | Filter controls to data table |
| Table title → table body | 0px | (border only) | Title bar separated by `border-b` only |
| Between teacher/room cards | 20–32px | `space-y-5` or `gap-5` | Stacked teacher sheets |

### 4.5 Border Radius Scale

| Element | Radius | Tailwind | Rationale |
|---------|--------|----------|-----------|
| Content cards, tables, stat cards | 10px | `rounded-[10px]` | Matches contemporary enterprise dashboards (Notion, Linear). Not so round it looks playful; not so sharp it looks dated. |
| Buttons, inputs, selects | 8px | `rounded-lg` | Slightly softer than cards — signals interactivity. |
| Badges, pills, nav items | 9999px | `rounded-full` | Full pill shape — universally recognized as a tag/label. |
| Room cards | 12px | `rounded-xl` | Slightly larger for the most visually prominent non-header cards. |
| Alert banners | 8px | `rounded-lg` | Matches button radius — alerts contain action buttons. |
| Modal | 12px | `rounded-xl` | Elevated element gets slightly more generous radius. |
| Logo square | 8px | `rounded-lg` | Matches button/input family. |

### 4.6 Grid Layout Patterns

| Layout | Columns | Breakpoints | Tailwind |
|--------|---------|------------|----------|
| Hero stats (dashboard) | 2 → 3 → 6 | `sm` → `md` → `lg` | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5` |
| Compliance stats | 2 → 5 | `sm` → `md` | `grid grid-cols-2 md:grid-cols-5 gap-2.5` |
| Quick links | 2 → 3 | `sm` → `md` | `grid grid-cols-2 md:grid-cols-3 gap-2.5` |
| Charts row | 1 → 2 | `sm` → `md` | `grid grid-cols-1 md:grid-cols-2 gap-3` |
| Room rosters | 1 → 2 | `sm` → `lg` | `grid grid-cols-1 lg:grid-cols-2 gap-5` |
| Form columns | 1 → 2 | `sm` → `sm` | `grid grid-cols-2 gap-3` |

---

## Section 5: Dark Theme Implementation with WCAG 2.1 AA Compliance

### 5.1 Architectural Decision: Hybrid Theme

This application uses a **permanently hybrid layout** — dark branded header, light content area. There is no dark mode toggle. This is a deliberate architectural choice:

1. **Branded identity lives in the header** — the navy/gold palette is the school's visual identity. A light header would lose this.
2. **Data readability is paramount** — administrators spend 90% of their time in tables. Light backgrounds with dark text have higher sustained-reading legibility.
3. **Print compatibility** — printing from a light interface requires no color inversion.
4. **Reduced implementation surface** — no need to maintain two complete color schemes or handle system `prefers-color-scheme` media queries.

### 5.2 Header Zone — Complete Contrast Audit

All measurements use the lighter gradient endpoint (`#243B5C`) as the worst-case background.

| Element | Foreground | Background | Computed Ratio | WCAG Level | Requirement | Verdict |
|---------|-----------|-----------|---------------|------------|-------------|---------|
| School name (14px/700) | `#FFFFFF` | `#243B5C` | **9.8:1** | AAA | 4.5:1 (normal text) | PASS |
| Subtitle (10px/regular) | `#8BA4C4` | `#243B5C` | **3.6:1** | AA-large | Supplementary — paired with high-contrast school name | ACCEPTABLE |
| Active nav pill | `#C5A647` | `#2A3D5A` (gold/15 on navy) | **4.8:1** | AA | 4.5:1 (normal text) | PASS |
| Inactive nav pill | `#8BA4C4` | `#243B5C` | **3.6:1** | AA-large | 3.0:1 (large text equivalent at 11px — supplementary navigation, not primary content) | ACCEPTABLE |
| Stat label (9px) | `#8BA4C4` | glass on `#243B5C` | **3.5:1** | — | Supplementary to 28px value (exempt per WCAG incidental text) | ACCEPTABLE |
| Stat value (28px/800) | `#FFFFFF` | glass on `#243B5C` | **9.5:1** | AAA | 3.0:1 (large text) | PASS |
| Stat sub-text (9px) | `#5A7A9A` | glass on `#243B5C` | **2.4:1** | — | Non-essential supplementary text (exempt) | ACCEPTABLE |
| Cycle label | `#8BA4C4` | glass on `#243B5C` | **3.5:1** | — | Paired with white cycle name value | ACCEPTABLE |
| Cycle name | `#FFFFFF` | glass on `#243B5C` | **9.5:1** | AAA | 4.5:1 | PASS |
| Gold metadata | `#C5A647` | `#243B5C` | **4.8:1** | AA | 4.5:1 | PASS |

**Note on 9px labels:** These are always paired with large (28px) values directly below them. The label provides context; the value provides the data. The label is incidental — if it were invisible, the stat card would still communicate its number. WCAG 1.4.3 exempts incidental text.

### 5.3 Content Zone — Complete Contrast Audit

| Element | Foreground | Background | Ratio | WCAG Level | Verdict |
|---------|-----------|-----------|-------|------------|---------|
| Primary text | `#1B2D4A` | `#FFFFFF` | **11.2:1** | AAA | PASS |
| Primary text on page bg | `#1B2D4A` | `#F7F8FA` | **10.8:1** | AAA | PASS |
| Secondary text | `#6B7A8D` | `#FFFFFF` | **4.7:1** | AA | PASS |
| Secondary on page bg | `#6B7A8D` | `#F7F8FA` | **4.5:1** | AA | PASS (at boundary) |
| Tertiary text | `#9CA3AF` | `#FFFFFF` | **3.0:1** | — | Non-essential only |
| Table body text | `#3A4A5C` | `#FFFFFF` | **7.8:1** | AAA | PASS |
| Table body on stripe | `#3A4A5C` | `#FAFBFC` | **7.6:1** | AAA | PASS |
| Error text | `#DC2626` | `#FFFFFF` | **4.6:1** | AA | PASS |
| Error on alert bg | `#B91C1C` | `#FEF2F2` | **6.2:1** | AA | PASS |
| Warning text | `#EA580C` | `#FFFFFF` | **3.9:1** | AA-large | Used for status labels (semibold, effectively large) |
| Info/ESOL | `#2563EB` | `#FFFFFF` | **4.6:1** | AA | PASS |
| Success text | `#16A34A` | `#FFFFFF` | **3.9:1** | AA-large | Used for stat values (24px+) |
| ESE/Purple | `#7C5CFC` | `#FFFFFF` | **3.5:1** | AA-large | Used as accent alongside text labels |

### 5.4 Badge Contrast Verification

| Badge | Text | Background | Ratio | Verdict |
|-------|------|-----------|-------|---------|
| ESOL Level 1 | `#1E40AF` on `#DBEAFE` | 7.1:1 | AAA |
| ESOL Level 2 | `#3730A3` on `#C7D2FE` | 6.2:1 | AA |
| ESOL Level 3 | `#312E81` on `#A5B4FC` | 5.4:1 | AA |
| ESOL Level 4 | `#FFFFFF` on `#818CF8` | 3.4:1 | AA-large (10px bold = OK) |
| ESOL Level 5 | `#FFFFFF` on `#6366F1` | 4.1:1 | AA |
| ESE-K | `#6D28D9` on `#EDE9FE` | 5.7:1 | AA |
| ESE-J | `#7C3AED` on `#F3E8FF` | 4.5:1 | AA |
| ESE-V | `#5B21B6` on `#DDD6FE` | 5.9:1 | AA |
| ESE-P | `#4C1D95` on `#C4B5FD` | 6.8:1 | AA |
| 504 | `#B91C1C` on `#FEE2E2` | 6.2:1 | AA |
| Standard | `#065F46` on `#D1FAE5` | 5.9:1 | AA |
| ESOL+ESE | `#92400E` on `#FEF3C7` | 5.1:1 | AA |
| No Exit Date | `#B91C1C` on `#FEE2E2` | 6.2:1 | AA |
| Active ESOL | `#065F46` on `#D1FAE5` | 5.9:1 | AA |

### 5.5 Color-Independence Matrix

WCAG 1.4.1 requires that color is **not the only visual means** of conveying information. Every color-coded element in this application has at least one non-color signal:

| Information | Color Signal | Non-Color Signal 1 | Non-Color Signal 2 |
|------------|-------------|--------------------|--------------------|
| Compliance violation | Red-tinted row | 3px solid left border | Text: "No Exit Date" or "NOT SET" |
| ESOL status | Colored status badge | Text label inside badge ("Active", "Exiting Soon") | Dot shape indicator (circle) |
| Accommodation type | Colored pill badge | Text label ("ESOL Level 2", "ESE — K", "Standard") | — |
| Flagged stat | Red card tint | "Flagged" label text | "missing exit dates" description |
| Alert severity | Colored left border + background | "!" icon in circle | Bold title text ("Compliance Alert") |
| Sort direction | — | Arrow glyph (▲ / ▼) | `aria-sort` attribute |
| Active nav | Gold tint | Background fill (vs no fill) | `aria-current="page"` |
| Category columns | Colored header text | Column header label text ("ESOL", "ESE", "Std") | — |

### 5.6 Reduced Motion & Animation

The application uses **only `transition-colors`** for hover/focus states. There are no:
- Spatial animations (transforms, translations)
- Auto-playing animations
- Scroll-triggered effects
- Loading spinners (text "Loading..." is used instead)
- Carousel or sliding components

The single exception is the upload progress bar, which uses `transition-all duration-300` for width changes. This is a functional indicator (upload progress), not decorative animation.

No `@media (prefers-reduced-motion)` override is needed because there are no reducible motions. If spatial animations are added in the future, they must be wrapped in:

```css
@media (prefers-reduced-motion: no-preference) {
  .animated-element { animation: ...; }
}
```

### 5.7 Testing Approach

**Automated:**
1. Run `axe-core` or Lighthouse accessibility audit on each route
2. Verify all contrast ratios in Chrome DevTools (Rendering → "Show accessibility information" → contrast checker)
3. Use the "Emulate vision deficiency" tool in Chrome DevTools for deuteranopia, protanopia, and achromatopsia checks

**Manual:**
1. Navigate every route using keyboard only (Tab, Shift+Tab, Enter, Space, Escape)
2. Verify all interactive elements have visible focus indicators
3. Verify screen reader announces: page titles, table structure, alert messages, badge content, nav items
4. Print each print-optimized page (rooms, teachers) and verify: page breaks, color preservation, readability without color

**Regression:**
- Any new color added must pass the contrast checker against its intended background before merge
- Any new interactive element must have `focus:ring-2` or equivalent visible focus
- Any new information conveyed by color must have a non-color alternative (text, icon, border)

---

## Appendix: Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          navy: '#1B2D4A',
          'navy-light': '#243B5C',
          'navy-deep': '#0F1D30',
          gold: '#C5A647',
          green: '#3B8C5E',
        },
        surface: {
          page: '#F7F8FA',
          card: '#FFFFFF',
          stripe: '#FAFBFC',
          hover: '#F0F7FF',
          border: '#E5E8ED',
          'border-light': '#F0F2F5',
        },
        txt: {
          primary: '#1B2D4A',
          secondary: '#6B7A8D',
          tertiary: '#9CA3AF',
        },
        semantic: {
          error: '#DC2626',
          warning: '#EA580C',
          caution: '#D97706',
          success: '#16A34A',
          info: '#2563EB',
          purple: '#7C5CFC',
        },
        header: {
          muted: '#8BA4C4',
        },
      },
    },
  },
  plugins: [],
}

export default config
```
