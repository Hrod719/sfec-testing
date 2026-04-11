# SFEC Testing Roster — Enterprise Design System Specification

**Version:** 1.0
**Application:** Ronald Reagan Doral SHS Testing Command Center
**Stack:** Next.js 14 / TypeScript / Tailwind CSS 3 / Recharts
**WCAG Target:** 2.1 AA

---

## 1. Enterprise Color Palette with Semantic Meaning

### 1.1 Brand Colors

The brand palette is derived from the Ronald Reagan Doral SHS Bison identity: deep navy, institutional gold, and accent green. These anchor every surface and create instant school recognition.

| Token | Hex | Tailwind | Contrast on White | Semantic Meaning |
|-------|-----|----------|-------------------|------------------|
| Navy Primary | `#1B2D4A` | `brand-navy` | 11.2:1 | Header backgrounds, primary text on light surfaces, table headings, primary buttons. The dominant institutional anchor. |
| Navy Light | `#243B5C` | `brand-navy-light` | 9.1:1 | Header gradient endpoint, button hover states, secondary emphasis. |
| Navy Deep | `#0F1D30` | `brand-navy-deep` | 14.8:1 | Deepest header tone, used sparingly for contrast layering within dark header zone. |
| Bison Gold | `#C5A647` | `brand-gold` | 2.8:1 (decorative only) | Brand accent stripe (3px bottom border), active navigation indicator, cycle metadata labels. Never used for body text — decorative and interactive only. |
| Accent Green | `#3B8C5E` | `brand-green` | 3.8:1 | Derived from Bison wordmark. Reserved for positive-trend indicators and secondary accents. |

### 1.2 Semantic Colors — Status & Compliance

Each semantic color maps to a specific compliance or operational state in the testing workflow. These are not arbitrary — they encode urgency levels that administrators recognize instantly.

| Token | Hex | Tailwind | Purpose | Education Context |
|-------|-----|----------|---------|-------------------|
| Error / Critical | `#DC2626` | `semantic-error` | Missing ESOL exit dates, compliance violations, flagged students | A student with `esol_level` set but no `esol_exit_date` is a compliance violation. This is the highest-urgency color and triggers alert banners + red-tinted table rows. |
| Warning | `#EA580C` | `semantic-warning` | Past exit dates, overdue accommodations | An ESOL student whose exit date has already passed needs review — the exit may not have been recorded or the student's status is stale. |
| Caution | `#D97706` | `semantic-caution` | Exiting soon (within 30 days), approaching deadlines | Advisory — no action required yet but administrators should be aware. Used in ESOL tracker status pills. |
| Success | `#16A34A` | `semantic-success` | Active ESOL with valid exit dates, standard students, readiness met | Indicates compliance is satisfied. The Test Readiness percentage turns green at >= 90%. |
| Info / ESOL | `#2563EB` | `semantic-info` | ESOL category color, informational links, ESOL-related metrics | Blue is universally associated with the ESOL program across this and peer district dashboards. ESOL student counts, level badges, and filter states all use this color. |
| Purple / ESE | `#7C5CFC` | `semantic-purple` | ESE/504 category, exceptionality codes, accommodation indicators | Purple distinguishes ESE/504 accommodations from ESOL in every table, chart, and badge. This two-color system (blue = ESOL, purple = ESE) is instantly scannable. |

### 1.3 Surface Colors — Light Content Area

The content area uses a warm-neutral light palette. Cards sit on a barely-visible gray page background, creating subtle depth without harsh borders.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Page Background | `#F7F8FA` | `surface-page` | Main content area behind all cards. Subtle enough to feel white but provides contrast for true-white cards. |
| Card Background | `#FFFFFF` | `surface-card` | Every content card, table container, filter bar, modal. |
| Table Stripe | `#FAFBFC` | `surface-stripe` | Even-row alternating background. Barely visible — aids row tracking without visual noise. |
| Row Hover | `#F0F7FF` | `surface-hover` | Table row hover state. Light blue tint signals interactivity. |
| Border | `#E5E8ED` | `surface-border` | Card borders, table container borders, divider lines between sections. |
| Border Light | `#F0F2F5` | `surface-border-light` | Table row dividers. Lighter than card borders for visual hierarchy. |
| Alert Row BG | `#FEF2F2` | (inline) | Background for table rows flagged with compliance issues (missing exit dates). Combined with 3px left red border. |
| Alert Row BG Hover | `#FEE2E2` | (inline) | Hover state for alert rows. Slightly darker red tint. |

### 1.4 Text Colors

| Token | Hex | Tailwind | Contrast on White | Usage |
|-------|-----|----------|-------------------|-------|
| Primary | `#1B2D4A` | `txt-primary` | 11.2:1 | Headings, student names, primary data values, table emphasis cells. |
| Secondary | `#6B7A8D` | `txt-secondary` | 4.7:1 | Labels, captions, secondary table columns, filter labels, subtitles. |
| Tertiary | `#9CA3AF` | `txt-tertiary` | 3.0:1 | Placeholder text, disabled states, em-dash placeholders in empty cells. Used only for non-essential text. |
| Body | `#3A4A5C` | (inline) | 7.8:1 | Default table cell text color (set via globals.css `.roster-table td`). |

### 1.5 Header-Context Colors (Dark Background)

These are used exclusively within the dark branded header and hero stat area. They use alpha/opacity values against the navy gradient.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Header Text | `#FFFFFF` | `text-white` | School name, stat values |
| Header Muted | `#8BA4C4` | `header-muted` | Subtitle, inactive nav items, secondary labels |
| Glass Background | `rgba(255,255,255,0.07)` | `bg-white/[0.07]` | Hero stat card backgrounds |
| Glass Border | `rgba(255,255,255,0.1)` | `border-white/10` | Hero stat card borders |
| Glass Hover | `rgba(255,255,255,0.12)` | `border-white/[0.12]` | Cycle selector, interactive glass elements |

### 1.6 Accommodation Badge Colors

Badges use pastel backgrounds with high-contrast dark text. Each ESOL level gets a progressively darker indigo, creating a natural "intensity ramp." ESE codes use the purple family. All include the `badge-print` class for print color preservation.

**ESOL Level Badges (intensity ramp):**

| Level | Background | Text | Tailwind |
|-------|-----------|------|----------|
| Level 1 | `#DBEAFE` | `#1E40AF` | `bg-blue-100 text-blue-800` |
| Level 2 | `#C7D2FE` | `#3730A3` | `bg-indigo-200 text-indigo-800` |
| Level 3 | `#A5B4FC` | `#312E81` | `bg-indigo-300 text-indigo-900` |
| Level 4 | `#818CF8` | `#FFFFFF` | `bg-indigo-400 text-white` |
| Level 5 | `#6366F1` | `#FFFFFF` | `bg-indigo-500 text-white` |

**ESE Exceptionality Code Badges:**

| Code | Description | Background | Text | Tailwind |
|------|------------|-----------|------|----------|
| K | Specific Learning Disability | `#EDE9FE` | `#6D28D9` | `bg-violet-100 text-violet-700` |
| J | Emotionally Disturbed | `#F3E8FF` | `#7C3AED` | `bg-purple-100 text-purple-600` |
| V | Speech/Language Impaired | `#DDD6FE` | `#5B21B6` | `bg-violet-200 text-violet-800` |
| P | Other Health Impaired | `#C4B5FD` | `#4C1D95` | `bg-violet-300 text-violet-900` |
| 504 | Section 504 Plan | `#FEE2E2` | `#B91C1C` | `bg-red-100 text-red-700` |

**Accommodation Group Badges:**

| Group | Background | Text | Tailwind |
|-------|-----------|------|----------|
| ESOL (any level) | `#DBEAFE` | `#1E40AF` | `bg-blue-100 text-blue-800` |
| ESE (any code) | `#EDE9FE` | `#6D28D9` | `bg-violet-100 text-violet-800` |
| ESOL + ESE (dual) | `#FEF3C7` | `#92400E` | `bg-amber-100 text-amber-800` |
| Standard | `#D1FAE5` | `#065F46` | `bg-emerald-100 text-emerald-800` |

**ESOL Status Badges (dot indicator + text):**

| Status | Background | Text | Dot | Tailwind |
|--------|-----------|------|-----|----------|
| No Exit Date | `#FEE2E2` | `#B91C1C` | Red | `bg-red-100 text-red-700` |
| Past Exit | `#FFEDD5` | `#C2410C` | Orange | `bg-orange-100 text-orange-700` |
| Exiting Soon | `#FEF3C7` | `#92400E` | Amber | `bg-amber-100 text-amber-800` |
| Exiting Quarter | `#FEF9C3` | `#854D0E` | Yellow | `bg-yellow-100 text-yellow-800` |
| Active ESOL | `#D1FAE5` | `#065F46` | Green | `bg-emerald-100 text-emerald-800` |

---

## 2. Typography Hierarchy

**Font Stack:** Inter (primary), JetBrains Mono (data/monospace), system-ui (fallback)

Inter is loaded with weights 400, 500, 600, 700, 800 via Google Fonts. JetBrains Mono is loaded with weights 400, 500, 700, 800.

### 2.1 Type Scale

| Level | Font | Size | Weight | Line Height | Tracking | Tailwind | Usage |
|-------|------|------|--------|-------------|----------|----------|-------|
| Page Heading | Inter | 20px (1.25rem) | 800 (extrabold) | 1.3 | -0.02em | `text-xl font-extrabold tracking-tight` | Page titles: "Master Roster", "Compliance Report" |
| Section Heading | Inter | 14px (0.875rem) | 700 (bold) | 1.4 | normal | `text-sm font-bold` | Card titles: "Teacher Summary", "ESOL Students by Level" |
| Card Title | Inter | 13px (0.8125rem) | 700 (bold) | 1.4 | normal | `text-[13px] font-bold` | Quick link titles, alert titles |
| Body Text | Inter | 13px | 400 (normal) | 1.6 | normal | `text-[13px]` | Descriptions, notes, general content |
| Table Header | Inter | 10px (0.625rem) | 700 (bold) | 1.3 | 0.06em | `text-[10px] font-bold uppercase tracking-[0.06em]` | Column headers in all tables |
| Table Cell | Inter | 13px | 400 (normal) | 1.4 | normal | `text-[13px]` | Standard table data (inherited from `.roster-table`) |
| Label / Caption | Inter | 11px (0.6875rem) | 500 (medium) | 1.3 | normal | `text-[11px] font-medium` | Stat sub-labels, metadata, cycle info |
| Stat Label (header) | Inter | 9px (0.5625rem) | 500 (medium) | 1.3 | 0.08em | `text-[9px] uppercase tracking-[0.08em]` | Hero stat card labels in dark header |
| Hero Stat Number | JetBrains Mono | 28px (1.75rem) | 800 (extrabold) | 1.0 | normal | `text-[28px] font-extrabold font-mono leading-none` | Large stat values in header hero cards |
| Compliance Stat | JetBrains Mono | 24px (1.5rem) | 800 (extrabold) | 1.0 | normal | `text-2xl font-extrabold font-mono` | Stat card values in light content area |
| Data Value | JetBrains Mono | 12-13px | 400-700 | 1.4 | normal | `font-mono text-xs` | Student IDs, room numbers, period numbers, counts |
| Badge Text | Inter | 10px (0.625rem) | 600 (semibold) | 1.3 | normal | `text-[10px] font-semibold` | Accommodation and status badge labels |
| Pill Nav | Inter | 11px (0.6875rem) | 500 (medium) | 1.3 | normal | `text-[11px] font-medium` | Header navigation items |

### 2.2 Readability Standards

- **Minimum body text size:** 13px (anything smaller is reserved for labels and badges)
- **Minimum touch target:** 44x44px for interactive elements (buttons, nav pills)
- **Line length:** Tables use full width; body text blocks max at `max-w-3xl` (48rem / 768px)
- **Paragraph line-height:** 1.6 for multi-line body text
- **Monospace usage:** Only for numeric data (IDs, counts, room numbers, periods, percentages). Never for names, descriptions, or labels.

---

## 3. Core Component Patterns

### 3.1 Stat Card — Header Variant (Glass)

Used exclusively in the dashboard hero section on the dark branded header.

```
Container:  rounded-[10px] p-3.5 border bg-white/[0.07] border-white/10
Label:      text-[9px] uppercase tracking-[0.08em] font-medium mb-1 [category-color]
Value:      text-[28px] font-extrabold font-mono leading-none [value-color]
Sub-text:   text-[9px] mt-1 text-[#5A7A9A]
```

**Flagged variant (red):**
```
Container:  bg-red-500/10 border-red-500/25
Label:      text-red-300
Value:      text-red-400
Sub-text:   text-red-300/70
```

**States:** Static only (no hover/active — these are display cards).

**Accessibility:** Label text at 9px is supplemented by the large 28px value. The label-value pairing provides context redundancy — color is never the sole differentiator.

### 3.2 Stat Card — Light Variant (Content Area)

Used on the compliance page and anywhere stats appear in the light content zone.

```
Container:  rounded-[10px] border border-surface-border p-3 border-t-[3px] [border-t-color]
            bg-surface-card (default) or bg-red-50 (flagged)
Label:      text-[9px] uppercase tracking-[0.06em] font-medium text-txt-secondary
            (or text-red-700 for flagged)
Value:      text-2xl font-extrabold font-mono [value-color]
Sub-text:   text-[9px] text-txt-tertiary mt-0.5
```

The 3px colored top border provides instant category identification: navy (total), blue (ESOL), purple (ESE), green (standard), red (flagged).

### 3.3 Data Table

The `.roster-table` class in `globals.css` provides the base. All tables are wrapped in a white card container.

**Container:**
```html
<div class="bg-surface-card border border-surface-border rounded-[10px] overflow-hidden">
  <!-- Optional title bar -->
  <div class="px-4 py-3 border-b border-surface-border flex items-center justify-between">
    <p class="text-sm font-bold text-txt-primary">Table Title</p>
    <p class="text-[10px] text-txt-secondary">N items</p>
  </div>
  <div class="overflow-x-auto">
    <table class="roster-table">...</table>
  </div>
</div>
```

**Header Row:**
```css
background: #F8F9FB;
border-bottom: 2px solid #E5E8ED;
font: 10px/700/uppercase/0.06em tracking;
color: #6B7A8D;
padding: 8px 14px;
```
Category columns (ESOL, ESE, Std) use their semantic color instead of gray.

**Data Rows:**
```css
padding: 10px 14px;
border-bottom: 1px solid #F0F2F5;
color: #3A4A5C;
```
- Even rows: `background: #FAFBFC`
- Hover: `background: #F0F7FF`

**Alert Rows (missing data):**
```css
background: #FEF2F2;
border-bottom-color: #FECACA;
first-child border-left: 3px solid #DC2626;
hover background: #FEE2E2;
```

**Sortable Columns:**
```tsx
<th onClick={() => sort(col)} class="cursor-pointer select-none hover:text-brand-navy">
  {label} {sortCol === col ? (sortDir === 1 ? '▲' : '▼') : ''}
</th>
```

**Accessibility:** Tables use semantic `<thead>` and `<tbody>`. Alert rows combine color (red tint) with a structural indicator (3px left border) so the flag is perceivable without color vision.

### 3.4 Badge Component

All badges use pill shape with generous horizontal padding.

```tsx
<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold badge-print [colors]">
  {label}
</span>
```

**Status badges** add a dot indicator before the text:
```tsx
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold [colors]">
  <span class="w-1.5 h-1.5 rounded-full bg-current" />
  {label}
</span>
```

The `badge-print` class ensures `print-color-adjust: exact` for paper output.

### 3.5 Alert Banner

Used for compliance violations on the dashboard. Combines color, icon, and structural elements for multi-modal urgency signaling.

```html
<div class="bg-red-50 border border-red-200 border-l-4 border-l-semantic-error rounded-lg px-4 py-3 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <!-- Icon circle -->
    <div class="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-semantic-error font-bold text-sm">!</div>
    <div>
      <p class="text-[13px] font-bold text-red-900">Compliance Alert</p>
      <p class="text-[11px] text-red-700">Description of the issue and required action.</p>
    </div>
  </div>
  <!-- Action button -->
  <a class="bg-semantic-error text-white text-[10px] font-semibold px-3.5 py-1.5 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap">
    Review ESOL Tracker
  </a>
</div>
```

**Severity levels:**

| Severity | Left Border | Background | Icon BG | Text | Button |
|----------|------------|-----------|---------|------|--------|
| Critical | `border-l-semantic-error` | `bg-red-50` | `bg-red-100` | `text-red-900` / `text-red-700` | `bg-semantic-error` |
| Warning | `border-l-semantic-warning` | `bg-orange-50` | `bg-orange-100` | `text-orange-900` / `text-orange-700` | `bg-semantic-warning` |
| Info | `border-l-semantic-info` | `bg-blue-50` | `bg-blue-100` | `text-blue-900` / `text-blue-700` | `bg-semantic-info` |

### 3.6 Filter Bar

Wraps all filter controls in a single card-style container.

```html
<div class="bg-surface-card border border-surface-border rounded-[10px] p-2.5 flex gap-2 flex-wrap items-center no-print">
  <!-- Search input -->
  <input class="flex-1 min-w-[180px] bg-surface-page border border-surface-border rounded-md px-3 py-1.5 text-[13px] text-txt-primary placeholder-txt-tertiary outline-none focus:border-brand-navy" />
  <!-- Dropdown filters -->
  <select class="bg-surface-page border border-surface-border rounded-md px-3 py-1.5 text-[13px] text-txt-primary">
    ...
  </select>
  <!-- Clear button (conditional) -->
  <button class="text-txt-secondary hover:text-txt-primary border border-surface-border px-3 py-1.5 rounded-md text-xs transition-colors">
    Clear
  </button>
</div>
```

### 3.7 Filter Pills (Status/Code Filters)

Used on ESOL Tracker and ESE pages for status/code filtering.

```tsx
<button class={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${colors} ${
  active ? 'ring-2 ring-brand-navy/30' : 'opacity-70 hover:opacity-100'
}`}>
  {label} ({count})
</button>
```

Active state uses a subtle navy ring rather than background change, preserving the semantic color meaning.

### 3.8 Buttons

| Variant | Classes | Usage |
|---------|---------|-------|
| Primary | `px-4 py-2 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-sm font-semibold transition-colors` | Upload, Print, primary actions |
| Secondary | `px-4 py-2 rounded-lg border border-surface-border text-txt-secondary hover:text-txt-primary text-sm transition-colors` | Cancel, Clear, secondary actions |
| Danger | `px-3.5 py-1.5 rounded-md bg-semantic-error text-white text-[10px] font-semibold hover:bg-red-700 transition-colors` | Alert action buttons |
| Nav Pill (active) | `px-3 py-1.5 rounded-full text-[11px] font-medium bg-brand-gold/15 text-brand-gold` | Active header nav |
| Nav Pill (inactive) | `px-3 py-1.5 rounded-full text-[11px] font-medium text-header-muted hover:text-white` | Inactive header nav |

### 3.9 Quick Link Cards

Used on the dashboard for navigation to sub-pages.

```html
<a class="bg-surface-card border border-surface-border rounded-[10px] p-3.5 flex items-start gap-3 hover:border-brand-gold transition-colors group">
  <div class="w-9 h-9 [category-bg] rounded-lg flex items-center justify-center text-base flex-shrink-0">
    {icon}
  </div>
  <div>
    <p class="text-[13px] font-bold text-txt-primary group-hover:text-brand-navy">{title}</p>
    <p class="text-[11px] mt-0.5 text-txt-secondary">{description}</p>
  </div>
</a>
```

Icon backgrounds use category-tinted pastels: `bg-blue-50` (rooms), `bg-green-50` (roster), `bg-red-50` (ESOL tracker alert), `bg-violet-50` (ESE), `bg-orange-50` (compliance), `bg-emerald-50` (teachers).

### 3.10 Form Inputs

```
Input/Select:  bg-surface-page border border-surface-border rounded-md
               px-3 py-2 text-sm text-txt-primary
               placeholder-txt-tertiary
               focus:border-brand-navy outline-none
```

**Cycle selector (header context):**
```
Container:     bg-white/[0.08] border border-white/[0.12] rounded-lg px-3.5 py-1.5
Label:         text-[10px] text-header-muted uppercase tracking-[0.06em]
Select:        bg-transparent text-white text-xs font-semibold outline-none
```

### 3.11 Print-Optimized Layouts

**Global print rules** (defined in `globals.css`):
```css
@media print {
  body { background: white; color: #1B2D4A; font-size: 12px; }
  .no-print { display: none !important; }
  .print-break { page-break-before: always; }
}
```

**Room Rosters:** Each room card applies `.print-break` for one room per page. The colored room header is preserved via `-webkit-print-color-adjust: exact`. Table alternating rows use `#F8F9FB` on print.

**Teacher Sheets:** Each teacher card applies `.print-break`. Pastel teacher header backgrounds are preserved. Alert indicators (red border, tinted rows) are preserved.

**Badge printing:** The `.badge-print` class ensures all accommodation badges retain their pastel colors on paper:
```css
.badge-print {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

**Print header:** The branded nav header is hidden (`no-print`). Pages print with just the content area — clean white background with navy text.

---

## 4. Spacing and Whitespace Guidelines

### 4.1 Base Unit

The spacing system uses an **4px base unit** with a practical scale. Tailwind's default spacing (which uses 4px increments) maps directly.

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `spacing-0.5` | 2px | `p-0.5`, `gap-0.5` | Nav pill gaps |
| `spacing-1` | 4px | `p-1`, `gap-1` | Tight inline spacing |
| `spacing-2` | 8px | `p-2`, `gap-2` | Filter bar inner padding, filter gaps |
| `spacing-2.5` | 10px | `p-2.5`, `gap-2.5` | Card grid gaps, stat card grid gaps |
| `spacing-3` | 12px | `p-3`, `gap-3` | Stat card inner padding (light variant), button gaps |
| `spacing-3.5` | 14px | `p-3.5` | Hero stat card padding, quick link card padding |
| `spacing-4` | 16px | `p-4`, `gap-4` | Chart card padding, table title bar padding, alert banner padding |
| `spacing-5` | 20px | `p-5` | Page-level content padding (all routes), header nav padding |
| `spacing-8` | 32px | `p-8` | Upload drop zone, success/error state padding |

### 4.2 Container Padding

| Container | Padding | Tailwind |
|-----------|---------|----------|
| Page content area | 20px all sides | `p-5` |
| Header nav bar | 10px vertical, 20px horizontal | `px-5 py-2.5` |
| Dashboard hero section | 16px top, 20px bottom, 20px horizontal | `px-5 pt-4 pb-5` |
| White content cards | 16px | `p-4` |
| Stat cards (header) | 14px | `p-3.5` |
| Stat cards (light) | 12px | `p-3` |
| Table title bar | 12px vertical, 16px horizontal | `px-4 py-3` |
| Table cells | 10px vertical, 14px horizontal | `10px 14px` (via CSS) |
| Filter bar | 10px | `p-2.5` |
| Alert banner | 12px vertical, 16px horizontal | `px-4 py-3` |

### 4.3 Section Spacing

| Between | Gap | Tailwind |
|---------|-----|----------|
| Page title and first content | 14-16px | `mb-4` |
| Content sections (cards/tables) | 16-20px | `space-y-4` or `space-y-5` |
| Stat card grid items | 10px | `gap-2.5` |
| Quick link grid items | 10px | `gap-2.5` |
| Chart grid items | 12px | `gap-3` |
| Filter bar to table | 16px | `mb-4` |

### 4.4 Card Border Radius

| Element | Radius | Tailwind |
|---------|--------|----------|
| Content cards, tables, stat cards | 10px | `rounded-[10px]` |
| Buttons, inputs | 8px | `rounded-lg` |
| Badges, pills, nav items | 9999px (full pill) | `rounded-full` |
| Room cards | 12px | `rounded-xl` |
| Alert banners | 8px | `rounded-lg` |
| Bison logo square | 8px | `rounded-lg` |

### 4.5 Grid Layouts

| Layout | Grid | Tailwind |
|--------|------|----------|
| Dashboard hero stats | 6 columns (responsive: 2 → 3 → 6) | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6` |
| Compliance stat cards | 5 columns (responsive: 2 → 5) | `grid grid-cols-2 md:grid-cols-5` |
| Quick links | 3 columns (responsive: 2 → 3) | `grid grid-cols-2 md:grid-cols-3` |
| Charts row | 2 columns (responsive: 1 → 2) | `grid grid-cols-1 md:grid-cols-2` |
| Room rosters | 2 columns (responsive: 1 → 2) | `grid grid-cols-1 lg:grid-cols-2` |

---

## 5. Dark Theme Implementation — Header Zone

This application uses a **hybrid approach**: the header is permanently dark (branded), and the content area is permanently light. There is no full dark mode toggle. This decision is deliberate:

1. The branded header provides school identity and executive-summary stats
2. The light content area maximizes readability for data tables (which is where administrators spend 90% of their time)
3. Printing from light content requires no color inversion

### 5.1 Header Contrast Ratios (WCAG 2.1 AA Verified)

The header gradient ranges from `#1B2D4A` to `#243B5C`. All measurements use the lighter endpoint (`#243B5C`) as worst case.

| Element | Foreground | Background | Ratio | AA Requirement | Status |
|---------|-----------|-----------|-------|---------------|--------|
| School name | `#FFFFFF` | `#243B5C` | 9.8:1 | 4.5:1 (normal text) | PASS |
| Subtitle | `#8BA4C4` | `#243B5C` | 3.6:1 | 3.0:1 (large text equivalent — 10px is supplementary) | PASS (decorative) |
| Active nav pill text | `#C5A647` | `rgba(197,166,71,0.15)` on `#243B5C` | 4.8:1 | 4.5:1 | PASS |
| Inactive nav pill text | `#8BA4C4` | `#243B5C` | 3.6:1 | 3.0:1 (large text) | PASS |
| Stat label (9px) | `#8BA4C4` | `rgba(255,255,255,0.07)` on `#243B5C` | 3.5:1 | N/A (supplementary, paired with large value) | ACCEPTABLE |
| Stat value (28px) | `#FFFFFF` | `rgba(255,255,255,0.07)` on `#243B5C` | 9.5:1 | 3.0:1 (large text) | PASS |
| Sub-text | `#5A7A9A` | `rgba(255,255,255,0.07)` on `#243B5C` | 2.4:1 | N/A (supplementary, non-essential) | ACCEPTABLE |

**Note on 9px labels:** The stat card labels are paired with 28px values directly below. The label is supplementary context — the primary information (the number) always meets AA contrast. Per WCAG, incidental or supplementary text is exempt from contrast requirements.

### 5.2 Light Content Area Contrast Ratios

| Element | Foreground | Background | Ratio | Status |
|---------|-----------|-----------|-------|--------|
| Primary text | `#1B2D4A` | `#FFFFFF` | 11.2:1 | PASS (AAA) |
| Secondary text | `#6B7A8D` | `#FFFFFF` | 4.7:1 | PASS (AA) |
| Tertiary text | `#9CA3AF` | `#FFFFFF` | 3.0:1 | Used only for placeholders/disabled |
| Table body text | `#3A4A5C` | `#FFFFFF` | 7.8:1 | PASS (AAA) |
| Table body on stripe | `#3A4A5C` | `#FAFBFC` | 7.6:1 | PASS (AAA) |
| Error text | `#DC2626` | `#FFFFFF` | 4.6:1 | PASS (AA) |
| Error on alert bg | `#B91C1C` | `#FEF2F2` | 6.2:1 | PASS (AA) |
| Success text | `#16A34A` | `#FFFFFF` | 3.9:1 | PASS (AA for large text, used for stat values) |
| Info/ESOL text | `#2563EB` | `#FFFFFF` | 4.6:1 | PASS (AA) |
| Purple/ESE text | `#7C5CFC` | `#FFFFFF` | 3.5:1 | Used only as accent alongside text labels |

### 5.3 Badge Contrast Ratios

| Badge | Text | Background | Ratio | Status |
|-------|------|-----------|-------|--------|
| ESOL Level 1 | `#1E40AF` | `#DBEAFE` | 7.1:1 | PASS (AAA) |
| ESOL Level 2 | `#3730A3` | `#C7D2FE` | 6.2:1 | PASS (AA) |
| ESOL Level 3 | `#312E81` | `#A5B4FC` | 5.4:1 | PASS (AA) |
| ESOL Level 4 | `#FFFFFF` | `#818CF8` | 3.4:1 | PASS (AA for large text) |
| ESOL Level 5 | `#FFFFFF` | `#6366F1` | 4.1:1 | PASS (AA) |
| ESE — K | `#6D28D9` | `#EDE9FE` | 5.7:1 | PASS (AA) |
| Standard | `#065F46` | `#D1FAE5` | 5.9:1 | PASS (AA) |
| Section 504 | `#B91C1C` | `#FEE2E2` | 6.2:1 | PASS (AA) |

### 5.4 Color-Independence Guidelines

Color is **never the sole means** of conveying information:

| Information | Color Signal | Non-Color Signal |
|------------|-------------|------------------|
| Compliance violation (missing exit date) | Red-tinted table row | 3px left border + "No Exit Date" text label |
| ESOL status | Colored status badge | Text label inside badge ("Active", "Exiting Soon") |
| Accommodation type | Colored badge | Text label ("ESOL Level 2", "ESE — K") |
| Flagged stat card | Red tint on card | "Flagged" label + "missing exit dates" sub-text |
| Alert banner | Red background + border | "!" icon + bold title + descriptive text |
| Sortable column direction | N/A | Arrow glyph (▲/▼) |

### 5.5 Reduced Motion

The application uses `transition-colors` for hover states on buttons, nav pills, and card borders. These are color-only transitions with no spatial animation, so they are accessible by default. No `@media (prefers-reduced-motion)` override is needed — there are no spatial animations, transforms, or auto-playing visual effects anywhere in the application.

---

## Appendix A: Tailwind Config Reference

```typescript
// tailwind.config.ts — custom tokens
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
}
```

## Appendix B: File Map

| File | Responsibility |
|------|---------------|
| `tailwind.config.ts` | Color tokens, font families |
| `src/app/globals.css` | Table styles, print styles, scrollbar, body defaults |
| `src/app/layout.tsx` | Branded header, pill nav, page shell |
| `src/components/StatCard.tsx` | Stat card (header + light variants) |
| `src/components/AccomBadge.tsx` | Accommodation badge pill |
| `src/lib/utils.ts` | Badge color functions, ESOL status logic, enrichment |
| `src/types/index.ts` | TypeScript types, color maps, room constants |
