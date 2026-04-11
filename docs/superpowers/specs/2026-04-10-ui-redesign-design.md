# UI Redesign — Executive Command Center

**Date:** 2026-04-10
**Approach:** C — Executive Command Center (hybrid light/dark)
**School:** Ronald Reagan Doral Senior High School — Home of the Bison
**Chart Library:** Recharts

---

## 1. Visual System

### Color Palette

**Brand Colors**
| Token | Hex | Usage |
|-------|-----|-------|
| `navy-primary` | `#1B2D4A` | Header background, primary text on light |
| `navy-light` | `#243B5C` | Header gradient end, hover states in header |
| `navy-deep` | `#0F1D30` | Darkest header shade |
| `bison-gold` | `#C5A647` | Brand accent, gold stripe, active nav, cycle metadata |
| `accent-green` | `#3B8C5E` | Wordmark green, secondary accent |

**Semantic Colors**
| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#DC2626` | Missing exit dates, critical alerts, flagged stat card |
| `warning` | `#EA580C` | Past exit date status |
| `caution` | `#D97706` | Exiting soon status |
| `success` | `#16A34A` | Active ESOL, standard students, readiness bar |
| `info` | `#2563EB` | ESOL category, links |
| `purple` | `#7C5CFC` | ESE/504 category |

**Surface Colors (Light Content Area)**
| Token | Hex | Usage |
|-------|-----|-------|
| `page-bg` | `#F7F8FA` | Main content background |
| `card-bg` | `#FFFFFF` | Cards, tables, modals |
| `table-stripe` | `#FAFBFC` | Alternating table rows |
| `table-hover` | `#F0F7FF` | Table row hover |
| `border` | `#E5E8ED` | Card borders, dividers |
| `border-light` | `#F0F2F5` | Table row dividers |
| `text-primary` | `#1B2D4A` | Headings, student names |
| `text-secondary` | `#6B7A8D` | Labels, captions, secondary info |
| `text-tertiary` | `#9CA3AF` | Placeholder text, disabled |

**Header-specific (dark context)**
| Token | Hex | Usage |
|-------|-----|-------|
| `header-text` | `#FFFFFF` | Primary text in header |
| `header-muted` | `#8BA4C4` | Secondary text, nav items |
| `header-glass` | `rgba(255,255,255,0.07)` | Stat card backgrounds |
| `header-glass-border` | `rgba(255,255,255,0.1)` | Stat card borders |

### Typography

- **Font family:** Inter (unchanged), JetBrains Mono for data
- **Page heading:** 28px / 800 weight / -0.02em tracking
- **Section heading:** 18px / 700
- **Subsection/Card title:** 14px / 600
- **Body text:** 13px / 400 / 1.6 line-height
- **Labels:** 11px / 500 / uppercase / 0.06em tracking
- **Stat labels (header):** 9px / 500 / uppercase / 0.08em tracking
- **Hero numbers:** 28px JetBrains Mono / 800
- **Table data:** 11-12px JetBrains Mono for IDs, numbers
- **Compliance stat numbers:** 24px JetBrains Mono / 800

### Spacing

- Page padding: 20px
- Card padding: 16px
- Card border-radius: 10px
- Card gap (grid): 10-12px
- Table row padding: 10px 14px
- Badge padding: 2-4px 8-12px
- Badge border-radius: 20px (full pill)

---

## 2. Layout Architecture

### Global Header (all pages)

The header is the branded dark nav bar, consistent across all routes:

```
[Bison Logo/R] Ronald Reagan Doral SHS     [Dashboard] [Upload] [Roster] [Rooms] [ESOL] [ESE] [Compliance] [Teachers]
               Testing Command Center
```

- Background: `linear-gradient(135deg, #1B2D4A, #243B5C)`
- Bottom border: 3px solid `#C5A647`
- Logo: Gold rounded square with "R" or Bison image (32-36px)
- Nav: Pill-style links. Active = `rgba(197,166,71,0.15)` bg with gold text. Inactive = `#8BA4C4` text
- Sticky, `z-50`, hidden on print

### Dashboard-specific Extension

On `/dashboard` only, the header extends downward to include:
- Cycle selector bar (glass-style dropdown)
- 6 hero stat cards in a grid (glass-morphism style on dark background)
- The gold bottom border moves to below the stats, not below the nav

### Content Area (all pages)

- Background: `#F7F8FA`
- Max-width: none (full width for tables)
- Padding: 20px
- All content in white cards with `border: 1px solid #E5E8ED` and `border-radius: 10px`

---

## 3. Component Specifications

### StatCard (Header — Dashboard only)

```
background: rgba(255,255,255,0.07)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 10px
padding: 14px

Label: 9px uppercase, color per category
Value: 28px JetBrains Mono 800, white or category color
Sub-text: 9px, #5A7A9A
```

Flagged card variant: `background: rgba(220,38,38,0.12)`, `border-color: rgba(220,38,38,0.25)`, red-tinted label/value.

### StatCard (Compliance — Light context)

```
background: #FFFFFF
border: 1px solid #E5E8ED
border-top: 3px solid [category-color]
border-radius: 10px
padding: 12px

Label: 9px uppercase #6B7A8D
Value: 24px JetBrains Mono 800, category color
```

Flagged variant: `background: #FEF2F2`, `border: 1px solid #FECACA`.

### Alert Banner

```
background: #FEF2F2
border: 1px solid #FECACA
border-left: 4px solid #DC2626
border-radius: 8px
padding: 12px 16px

Icon: 28px circle, #FEE2E2 bg, "!" in #DC2626
Title: 13px / 700, #991B1B
Body: 11px, #B91C1C
Action button: #DC2626 bg, white text, 10px font, 6px 14px padding, rounded 6px
```

### Data Table

**Container:** White card with border, `border-radius: 10px`, `overflow: hidden`.

**Title row:** 12-14px / 700 with optional subtitle, separated by bottom border.

**Header row:**
```
background: #F8F9FB
border-bottom: 2px solid #E5E8ED
font: 9-10px / 600-700 / uppercase / 0.06em tracking
color: #6B7A8D (or category color for ESOL/ESE/Std columns)
padding: 8px 14px
```

**Data rows:**
```
padding: 10px 14px
border-bottom: 1px solid #F0F2F5
Even rows: background #FAFBFC
Hover: background #F0F7FF
```

**Alert rows (missing data):**
```
background: #FEF2F2
border-bottom: 1px solid #FECACA
border-left: 3px solid #DC2626
Student name color: #991B1B
```

**Sortable columns:** Active sort shows arrow indicator (▲/▼) next to column name.

### Filter Bar

```
background: #FFFFFF
border: 1px solid #E5E8ED
border-radius: 10px
padding: 10px 14px
display: flex, gap: 8px, flex-wrap

Search input: #F7F8FA bg, 1px #E5E8ED border, rounded 6px, magnifying glass icon
Filter dropdowns: Same styling as search, with ▼ indicator
```

### Accommodation Badges

All badges: `padding: 2-4px 8-12px`, `border-radius: 20px`, `font-size: 10-11px`, `font-weight: 600`.

| Type | Background | Text |
|------|-----------|------|
| ESOL Level 1 | `#DBEAFE` | `#1E40AF` |
| ESOL Level 2 | `#C7D2FE` | `#3730A3` |
| ESOL Level 3 | `#A5B4FC` | `#312E81` |
| ESOL Level 4 | `#818CF8` | `#FFFFFF` |
| ESOL Level 5 | `#6366F1` | `#FFFFFF` |
| ESE — K | `#EDE9FE` | `#6D28D9` |
| ESE — J | `#F3E8FF` | `#7C3AED` |
| ESE — V | `#DDD6FE` | `#5B21B6` |
| ESE — P | `#C4B5FD` | `#4C1D95` |
| Section 504 | `#FEE2E2` | `#B91C1C` |
| ESOL + ESE | `#FEF3C7` | `#92400E` |
| Standard | `#D1FAE5` | `#065F46` |

### ESOL Status Badges

Pill badges with dot indicator (●):

| Status | Background | Text |
|--------|-----------|------|
| No Exit Date | `#FEE2E2` | `#B91C1C` |
| Past Exit | `#FFEDD5` | `#C2410C` |
| Exiting Soon | `#FEF3C7` | `#92400E` |
| Exiting Quarter | `#FEF9C3` | `#854D0E` |
| Active ESOL | `#D1FAE5` | `#065F46` |

### Quick Link Cards

```
background: #FFFFFF
border: 1px solid #E5E8ED
border-radius: 10px
padding: 14px
display: flex, gap: 10px

Icon: 36px square, rounded 8px, tinted background matching category
Title: 13px / 700, #1B2D4A
Description: 11px, #6B7A8D (or #DC2626 for alert descriptions)
Hover: border-color transitions to #C5A647
```

### Buttons

**Primary:** `background: #1B2D4A`, `color: #FFFFFF`, `padding: 8px 20px`, `border-radius: 8px`, `font: 13px/600`. Hover: `#243B5C`.

**Secondary:** `background: transparent`, `border: 1px solid #E5E8ED`, `color: #6B7A8D`, same sizing. Hover: `border-color: #1B2D4A`, `color: #1B2D4A`.

**Danger:** `background: #DC2626`, `color: #FFFFFF`. Used for compliance action buttons.

---

## 4. Page-Specific Designs

### Dashboard (`/dashboard`)

**Structure:**
1. Extended branded header with cycle selector + 6 hero stat cards
2. Light content area:
   - Compliance alert banner (conditional, shown when flagged > 0)
   - 3x2 quick link grid
   - Teacher summary table

**Hero stats (left to right):** Total Students, Test Readiness %, ESOL, ESE/504, Standard, Flagged.

**Test Readiness** is calculated as `(total - missingExitDates) / total * 100`. Shows progress bar beneath the number. Green when >= 90%, yellow 70-89%, red < 70%.

### Upload (`/upload`)

Light content area only (no extended header). Same drop zone + preview + cycle workflow, restyled with:
- White card drop zone with dashed `#E5E8ED` border
- Preview table using new table component
- Cycle selector with new form styling
- Progress bar: `#1B2D4A` fill on `#E5E8ED` track

### Master Roster (`/roster`)

**Structure:**
1. Page title + subtitle (student count + cycle name)
2. Filter bar (search + room/teacher/accommodation/grade dropdowns)
3. Full data table with columns: ID, Student Name, Teacher, Grade, Accommodation (badge), Room, ESOL Status (badge), Period
4. Sortable columns with arrow indicators

Alert rows for students with missing ESOL exit dates: red-tinted with left border.

### Room Rosters (`/rooms`)

**Structure:**
1. Page title
2. Grid of room cards (2 columns on desktop)

Each room card:
- White card with colored top border (using existing ROOM_COLORS, adjusted for light theme)
- Room name header with student count
- Numbered student list

**Print:** Each room card gets `page-break-before: always`. White background, dark text, colored headers preserved with `-webkit-print-color-adjust: exact`.

### ESOL Tracker (`/tracker`)

**Structure:**
1. Page title with status filter pills (pill buttons showing counts per status)
2. Data table sorted by urgency
3. Columns: Name, ID, Grade, Period, Teacher, Language, Level (badge), Exit Date, Days Until, Room, Status (badge)

Status filter pills use the same colors as ESOL status badges. Active pill is filled, inactive is outline.

### ESE & 504 (`/ese`)

**Structure:**
1. Page title with code filter pills (K, J, V, P, 504)
2. Data table with columns: Name, ID, Grade, Teacher, ESE Code (badge), Description, Room, Proctor Notes (editable)
3. Proctor notes: inline text input, saves to localStorage

### Compliance (`/compliance`)

**Structure:**
1. Page title
2. 5 stat cards in a row (top-border colored): Total, ESOL, ESE/504, Standard, Missing Exit
3. 2-column chart grid:
   - **ESOL by Level** — Recharts `BarChart`, vertical bars, one per level (1-5), using the ESOL level badge color progression
   - **Accommodation Breakdown** — Recharts `PieChart` (donut), 3 segments (ESOL/ESE/Standard), center label showing total
4. **Room Distribution** — Recharts horizontal `BarChart`, stacked bars (Standard/ESOL/ESE per room), with legend
5. **Language Distribution** — table or horizontal bars
6. **Teacher Summary** — same table component as dashboard

### Teacher Sheets (`/teachers`)

**Structure:**
1. Page title with "Print All" button
2. One card per teacher, each containing:
   - Header with teacher name, room, periods, student count
   - Accommodation counts row
   - Student table sorted by period then name

**Print:** Each teacher card gets `page-break-before: always`. Professional formatting with school branding in header.

---

## 5. Tailwind Configuration Updates

```typescript
// tailwind.config.ts additions
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
  text: {
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

---

## 6. Print Stylesheet

**Global print rules:**
- `body { background: white; color: #1B2D4A; }`
- `.no-print { display: none !important; }`
- `.print-break { page-break-before: always; }`
- Header nav hidden on print
- Tables: `#F8F9FB` header background preserved, stripe rows `#FAFBFC`
- Badges: preserve background colors with `-webkit-print-color-adjust: exact`
- Room cards: colored top borders preserved
- Teacher sheets: school name + cycle info printed in a compact header per page

---

## 7. New Dependencies

- `recharts` — bar charts, pie/donut charts, stacked bars for compliance page
- No other new dependencies

---

## 8. Files to Modify

1. `tailwind.config.ts` — extended color palette
2. `src/app/globals.css` — rewrite table styles, print styles, surfaces
3. `src/app/layout.tsx` — new branded header with pill nav, gold stripe
4. `src/components/StatCard.tsx` — two variants (header glass + light card)
5. `src/components/AccomBadge.tsx` — updated badge colors
6. `src/app/dashboard/page.tsx` — extended header with hero stats, light content area
7. `src/app/upload/page.tsx` — light theme restyling
8. `src/app/roster/page.tsx` — new filter bar + table design
9. `src/app/rooms/page.tsx` — light cards with colored top borders
10. `src/app/tracker/page.tsx` — status filter pills + new table
11. `src/app/ese/page.tsx` — code filter pills + new table
12. `src/app/compliance/page.tsx` — Recharts charts + new stat cards
13. `src/app/teachers/page.tsx` — light cards, print layout
14. `src/lib/utils.ts` — updated badge color functions for light theme
