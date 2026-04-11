# SFEC Testing Roster — Accessibility Personas & Testing Framework

**Purpose:** Operationalize the accessibility audit protocol by anchoring it to real user needs. Each persona maps directly to testing protocol sections, prioritizes routes and components, and provides recruiting and session guidance for usability validation.

---

## Persona 1: Mr. Daniel Reyes — Biology Teacher with Deuteranopia

### Identity & Role

- **Title:** Biology Teacher, 11th Grade
- **Experience:** 8 years at Ronald Reagan Doral SHS
- **Context:** Teaches 5 periods of Biology I. Responsible for 142 students across the Biology EOC testing cycle. Serves as a period proctor during standardized testing. Uses the roster app daily during the two weeks before testing to review his student list, confirm room assignments, and identify which students need accommodations.
- **Age:** 34
- **Technical comfort:** Moderate. Uses Google Classroom and Canvas daily. Comfortable with web apps but does not customize browser settings beyond bookmarks.

### Primary Accessibility Need

**Deuteranopia (red-green color blindness).** Daniel has difficulty distinguishing red from green hues. Both appear as shades of brown or olive to him. He was diagnosed in elementary school and has developed compensating strategies — he relies heavily on text labels, position, and context rather than color alone. He does not use any assistive technology; his need is purely perceptual.

### Interaction Patterns

**Primary workflow (test-prep week):**
1. Opens `/dashboard` to check overall testing readiness
2. Navigates to `/roster` and filters by his name to see his students
3. Scans the accommodation column to identify who needs ESOL or ESE support
4. Checks `/rooms` to see which room he's proctoring and who's in it
5. Prints his room roster for the proctor binder

**Frequency:** Daily during test-prep weeks (10 sessions), occasional otherwise.

**Most-used routes:** `/roster` (60%), `/rooms` (25%), `/dashboard` (15%)

### Accessibility Requirements

- Accommodation badges must be identifiable **without relying on red-green color distinction**. The badge text ("ESOL Level 2", "ESE — K", "Standard") is the primary identifier; color is supplementary.
- Alert rows for flagged students must not rely solely on the red background tint. The 3px left border and text label ("No Exit Date", "NOT SET") must be sufficient.
- Chart segments in `/compliance` (green for Standard, red for flagged) must have legends with text labels. Stacked bar segments need distinct textures or labels if green and red are adjacent.
- The "Test Readiness" stat card (green at >= 90%, text changes to "on track" vs "needs attention") must communicate status via text, not color alone.

### Current Pain Points

1. **Badge scanning speed:** When quickly scanning a 30-student roster, Daniel cannot use color to batch-identify "all ESOL students" at a glance. He reads each badge's text label individually, which takes 3-4x longer than a color-sighted colleague.
2. **Alert row detection:** The red-tinted rows for missing exit dates (`#FEF2F2`) appear nearly identical to the standard white and striped rows in his perception. He relies on the 3px left border — but this is a thin visual element that can be missed when scrolling quickly through a long table.
3. **Donut chart on compliance page:** The ESOL (blue) segment is clearly visible, but the Standard (green) and any red indicators merge into similar muddy tones. He skips the chart and reads the raw numbers instead.
4. **Status filter pills on ESOL tracker:** "No Exit Date" (red pill) and "Active" (green pill) appear nearly identical. He distinguishes them by reading the text, but the initial visual scan provides no guidance about which pills represent problems vs healthy states.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **Badge identification under time pressure** | Display a roster of 25 students. Ask Daniel to identify all ESE students within 60 seconds. | Identifies >= 90% of ESE students. Compare completion time to a color-sighted baseline. | 1.1.3 Deuteranopia |
| 2 | **Alert row detection** | Display a roster with 3 alert rows scattered among 20 normal rows. Ask Daniel to find the flagged students. | Finds all 3 within 30 seconds. If he misses any, document which visual cue was insufficient. | 1.2 Color Independence |
| 3 | **Filter pill differentiation** | Navigate to `/tracker`. Ask Daniel: "Which button shows students who have a problem?" | Correctly identifies "No Exit Date" pill without reading all labels. If he reads labels to decide, document as a speed issue (not a failure). | 1.1.3 Deuteranopia |
| 4 | **Compliance chart comprehension** | Open `/compliance`. Ask: "Which room has the most ESOL students?" using the stacked bar chart. | Correctly identifies the room. If he reads the tooltip/numbers instead of the bars, document as a workaround (chart color alone is insufficient). | 1.1.3 Deuteranopia |

### Recruitment Criteria

**Screening questions:**
1. "Have you been diagnosed with any form of color vision deficiency? If so, which type?" (Looking for: deuteranopia, deuteranomaly, or "red-green color blind")
2. "Do you currently teach in a high school or middle school?" (Looking for: active teacher who understands the testing workflow)
3. "Have you ever had difficulty with color-coded data in spreadsheets, charts, or dashboards?" (Looking for: self-aware about the specific challenge)
4. "Do you use any browser extensions or OS settings to help with color differentiation?" (Documents whether they use accessibility tools)
5. "Would you be willing to share what colors look like to you for specific elements on screen during our session?" (Confirms willingness to articulate perception)

### Testing Protocol Mapping

- **Audit sections:** 1.1.3 (Color Vision Deficiency), 1.2 (Color Independence)
- **Critical components:** AccomBadge, alert rows, StatCard (flagged variant), Recharts charts, filter pills
- **Critical routes:** `/roster`, `/tracker`, `/compliance`

---

## Persona 2: Dr. Yolanda Freeman — Assistant Principal with Carpal Tunnel Syndrome

### Identity & Role

- **Title:** Assistant Principal, Testing Coordinator
- **Experience:** 18 years in education, 6 as AP. Previously a math teacher and department chair.
- **Context:** Oversees all standardized testing logistics for the school. She is the primary user of the compliance dashboard. She uploads rosters, reviews compliance data, generates reports for the principal and district, and distributes room assignments to proctors. During test-prep week, she uses the app 2-3 hours per day.
- **Age:** 47
- **Technical comfort:** High. Former math teacher who is fluent with spreadsheets and data tools.

### Primary Accessibility Need

**Bilateral carpal tunnel syndrome causing chronic wrist pain.** Dr. Freeman uses a trackpad with light-touch sensitivity but experiences significant pain after extended mouse/trackpad use. She has trained herself to navigate primarily with keyboard (Tab, Enter, Arrows, Escape) and uses the mouse only when keyboard navigation fails. She does not use voice control or switch devices — her keyboard use is functional but she strongly prefers workflows that minimize total keystrokes and never require rapid or repeated mouse movements.

### Interaction Patterns

**Primary workflow:**
1. Uploads CSV roster via `/upload` (monthly during data refresh)
2. Reviews `/dashboard` for readiness overview
3. Navigates to `/compliance` for the detailed report she emails to the principal
4. Prints `/rooms` rosters for proctor binders
5. Prints `/teachers` sheets for teacher mailboxes
6. Uses `/tracker` to identify and follow up on ESOL compliance gaps

**Frequency:** Heavy use during test-prep (daily, 2-3 hours). Monthly for roster uploads. Occasional otherwise.

**Most-used routes:** `/compliance` (30%), `/dashboard` (20%), `/rooms` (15%), `/teachers` (15%), `/upload` (10%), `/tracker` (10%)

### Accessibility Requirements

- Every interactive element (buttons, links, inputs, selects, filter pills, sortable columns) must be reachable via Tab/Shift+Tab.
- Focus indicators must be clearly visible — a faint or absent focus ring means she loses track of her position and must resort to the trackpad.
- Filter dropdowns must be operable with Arrow keys after receiving focus.
- Print buttons must be keyboard-activatable (Enter/Space).
- The upload flow (drag-and-drop zone) must have a keyboard alternative — she cannot drag and drop. The file input click trigger (Enter on the drop zone) is essential.
- Modals (if added) must trap focus and support Escape to close.
- No keyboard shortcuts that require Ctrl+Shift or other multi-key combinations with wrist rotation.

### Current Pain Points

1. **Drop zone ambiguity:** The upload drop zone looks like it requires drag-and-drop. She discovered by accident that clicking it opens the file picker, but there's no visible "Browse files" button or keyboard instruction. She sometimes wastes time wondering if the feature is broken.
2. **Filter controls require many Tabs:** On the roster page, reaching the 5th filter (Grade) requires tabbing through the search input, room select, teacher select, and accommodation select first. She would prefer a single "Filters" button that opens a panel, or at minimum, keyboard shortcuts (e.g., Alt+R for Room filter).
3. **No skip link:** She must Tab through all 8 header nav items before reaching the page content. On a page she visits 10 times a day, this is 80+ unnecessary Tab presses.
4. **Sort state not announced:** When she Tabs to a sortable column header and presses Enter, the table re-sorts but there's no confirmation. She must visually verify that the sort worked — she'd prefer `aria-sort` to be announced by her occasional screen reader use.
5. **Print via keyboard:** The print button works with Enter, which is correct. But after printing, the browser's print dialog steals focus and she must Tab extensively to return to the app.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **Full workflow without mouse** | Complete the entire upload-to-print workflow using keyboard only: upload CSV → check dashboard → navigate to rooms → print. | All tasks completable. Document every point where she reaches for the trackpad. | 1.3 Keyboard Navigation |
| 2 | **Filter by accommodation, keyboard only** | On `/roster`, filter to show only ESOL students using keyboard. | Filter applied within 45 seconds. Count total Tab presses required. | 1.3.2 Route-Specific |
| 3 | **Focus tracking on long page** | Navigate `/compliance` top to bottom using Tab only. | Focus indicator is visible at every stop. She never loses track of her position. | 1.4 Focus Management |
| 4 | **Upload without drag-and-drop** | Navigate to `/upload`, activate the file picker using keyboard only. | File picker opens via Enter on the drop zone. If she cannot find the activation method within 30 seconds, document as failure. | 1.3.2 Route-Specific |

### Recruitment Criteria

**Screening questions:**
1. "Do you experience chronic pain, fatigue, or limited range of motion in your hands or wrists that affects how you use a computer?" (Looking for: carpal tunnel, RSI, arthritis, or similar)
2. "Do you primarily navigate websites using your keyboard rather than a mouse or trackpad?" (Looking for: keyboard-primary users)
3. "When you encounter a website feature that requires mouse-only interaction (like drag-and-drop), what do you do?" (Looking for: awareness of alternative methods and frustration with inaccessible patterns)
4. "Do you use any assistive technology such as voice control, switch devices, or alternative keyboards?" (Documents tool usage)
5. "How many hours per day do you spend working on a computer?" (Establishes whether pain is a daily factor)

### Testing Protocol Mapping

- **Audit sections:** 1.3 (Keyboard Navigation), 1.4 (Focus Management), 1.6 (Form Accessibility)
- **Critical components:** Filter bar, upload drop zone, sortable table headers, print buttons, nav pills, cycle selector
- **Critical routes:** All 8 (keyboard must work everywhere), priority on `/upload`, `/roster`, `/compliance`

---

## Persona 3: Mrs. Patricia Delgado — Guidance Counselor Who Is Blind

### Identity & Role

- **Title:** Guidance Counselor, ESE/504 Liaison
- **Experience:** 14 years. Responsible for reviewing accommodation plans, verifying that students with ESE exceptionalities and 504 plans receive mandated testing accommodations.
- **Context:** She reviews the ESE & 504 tracker weekly to confirm all her students are correctly listed with the right codes. She cross-references the app's data with IEP documents. She escalates discrepancies to the assistant principal.
- **Age:** 52
- **Technical comfort:** High. She is a proficient VoiceOver user on macOS and uses Safari as her primary browser. She navigates by headings, landmarks, and table structure. She types at 70 WPM.

### Primary Accessibility Need

**Total blindness (congenital).** Mrs. Delgado uses VoiceOver with Safari on a MacBook Air. She has a refreshable Braille display but primarily uses audio output. She relies entirely on semantic HTML structure: landmarks (`<nav>`, `<main>`, `<header>`), headings (`<h1>`-`<h6>`), table structure (`<thead>`, `<th>`, `<td>`), ARIA roles, and live regions. Visual styling (colors, badges, icons) is invisible to her.

### Interaction Patterns

**Primary workflow:**
1. Opens `/ese` to review ESE/504 students
2. Uses VoiceOver table navigation (Ctrl+Alt+Arrow keys) to read each student's code, grade, teacher, and testing room
3. Cross-references with her paper IEP binder
4. Checks `/tracker` to verify ESOL students she co-serves (dual ESOL+ESE) have exit dates
5. Opens `/compliance` to get aggregate numbers for her monthly report to the district

**Frequency:** Weekly during the semester, daily during test-prep week.

**Most-used routes:** `/ese` (50%), `/tracker` (25%), `/compliance` (25%)

### Accessibility Requirements

- All data tables must use proper `<thead>` and `<th>` elements so VoiceOver announces column headers when navigating cells.
- Badge content must be pure text — not conveyed through `background-color` or `::before` pseudo-elements. The badge `<span>` must contain the readable text "ESE — K" or "ESOL Level 2."
- Alert rows must include text content ("No Exit Date" or "NOT SET") that VoiceOver reads. The 3px red border and tinted background are invisible to her.
- The compliance alert banner must use `role="alert"` so VoiceOver announces it on page load without requiring her to navigate to it.
- Status badges must include text labels. The colored dot indicator (●) must be `aria-hidden="true"` since it conveys no information to a screen reader.
- The page must have a logical heading hierarchy — she navigates by pressing VO+Command+H to jump between headings.
- All form controls must have associated labels or `aria-label` attributes.
- The cycle selector must be a standard `<select>` element (not a custom dropdown) for native VoiceOver support.
- Charts on `/compliance` are entirely invisible to her. She needs text alternatives: either an `aria-label` summarizing the data or a nearby data table containing the same numbers.

### Current Pain Points

1. **No heading hierarchy on most pages:** Many pages use `<h2>` as the page title but have no further heading structure. Card titles are styled `<p>` elements with `font-bold`, not `<h3>`. She must read linearly through the entire page to find sections, which takes 5-10x longer than heading navigation.
2. **Filter pills have no toggle state:** On `/ese`, the code filter pills visually show selection via a ring, but there is no `aria-pressed` attribute. She cannot determine which filters are active without reading the table results and inferring.
3. **No live region for filter results:** When she applies a filter on `/ese`, the table updates but nothing is announced. She must manually navigate back to the table to discover the results changed.
4. **Charts are black boxes:** The Recharts SVG content on `/compliance` is announced as a generic group or ignored entirely. She gets no information from the bar chart or donut chart.
5. **Table sort state unknown:** After activating a sort on `/roster`, there is no `aria-sort` attribute on the `<th>`. She cannot confirm whether the sort was applied or which direction it sorted.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **ESE student review** | Using VoiceOver on `/ese`, navigate the table and identify all students with code "K". | She can navigate by table cells and correctly identify all K-coded students. Column headers are announced for each cell. | 1.5.2 Data Tables |
| 2 | **Compliance flag detection** | Open `/dashboard` with 8 flagged students. Using VoiceOver, determine: (a) how many students are flagged, (b) what the problem is, (c) where to go to fix it. | VoiceOver announces the alert banner content including the CTA link. She does not need to navigate past the alert to understand the issue. | 1.5.4 Alerts and Live Regions |
| 3 | **Filter and verify** | On `/ese`, filter to only "504" students. Using VoiceOver, confirm the filter is active and read the first student's information. | `aria-pressed="true"` is announced on the 504 pill. Table content reflects only 504 students. A live region announces the result count. | 1.5.3 Badges, 1.5.5 Forms |
| 4 | **Compliance numbers** | Open `/compliance`. Get the total ESOL count and the count of students missing exit dates. | She can get these numbers from either the stat cards (text content) or the data tables below. Charts are NOT required — but if charts are the only source, this is a failure. | 1.5.2 Data Tables |

### Recruitment Criteria

**Screening questions:**
1. "Do you use a screen reader as your primary way of interacting with websites? If so, which screen reader and browser combination?" (Looking for: VoiceOver+Safari, NVDA+Chrome, or JAWS+Chrome)
2. "How do you typically navigate a data-heavy web page — by headings, by landmarks, by links, or linearly?" (Looking for: heading/landmark navigation preference, which tests our HTML structure)
3. "Have you used data table-heavy applications (like a gradebook, SIS, or spreadsheet) with your screen reader? What works well and what doesn't?" (Looking for: real-world table navigation experience)
4. "Do you work in education — as a teacher, counselor, or administrator?" (Looking for: understands the compliance context)
5. "When you encounter a chart or graph on a website, how do you access the information?" (Looking for: awareness of text alternatives vs frustration with inaccessible SVGs)

### Testing Protocol Mapping

- **Audit sections:** 1.5 (Screen Reader Compatibility — all subsections), 1.6 (Form Accessibility)
- **Critical components:** All data tables, badges (text content), alert banner (`role="alert"`), filter pills (`aria-pressed`), cycle selector (standard `<select>`), chart alt text
- **Critical routes:** `/ese`, `/tracker`, `/compliance`, `/dashboard`

---

## Persona 4: Ms. Anh Tran — Math Teacher with Vestibular Migraine

### Identity & Role

- **Title:** Algebra II Teacher
- **Experience:** 6 years. Cross-assigned as a testing proctor for the Biology EOC since her planning period aligns with the testing window.
- **Context:** She uses the app briefly — primarily to look up her room assignment and print her room roster. She spends at most 5-10 minutes in the app per testing cycle.
- **Age:** 29
- **Technical comfort:** High. Personal tech-savvy; uses her phone for most tasks. Accesses the app on her classroom desktop (Chrome on Windows).

### Primary Accessibility Need

**Vestibular migraine disorder.** Certain visual stimuli can trigger migraine episodes with vertigo, nausea, and light sensitivity. Her specific triggers include: rapid screen movement (parallax scrolling, sliding panels, carousel animations), flashing or pulsing elements, and sudden layout shifts. She keeps `prefers-reduced-motion: reduce` enabled in her OS settings permanently. She also uses a blue-light filter extension. A triggered episode means she cannot work for the rest of the day.

### Interaction Patterns

**Primary workflow (once per testing cycle):**
1. Opens `/dashboard` to find her room assignment in the teacher summary
2. Navigates to `/rooms` to see her student list
3. Prints the room roster
4. Done — total interaction time: 5-10 minutes

**Frequency:** 2-3 times per school year (once per testing cycle).

**Most-used routes:** `/rooms` (60%), `/dashboard` (40%)

### Accessibility Requirements

- `prefers-reduced-motion: reduce` must be respected. All `transition-*` and `animation-*` CSS must resolve to `0ms` or `0.01ms` duration.
- No element should change position on screen without user-initiated action (no auto-scroll, no sliding panels, no layout shift after data load).
- Loading states should be static text ("Loading..."), never a spinning or pulsing indicator.
- Table row hover effects should be color-only (no scale transform, no shadow animation).
- Modal open/close (if implemented) should be instant (no slide-in or fade-in animation).
- The upload progress bar width transition should be instant under reduced-motion preference.
- No auto-playing content, background video, or animated gradients.

### Current Pain Points

1. **Progress bar animation:** The upload page progress bar uses `transition-all duration-300` which creates smooth width changes. Under `prefers-reduced-motion`, this should be instant. Currently, it is not conditioned on the media query.
2. **Hover transitions:** `transition-colors` is applied globally to buttons, links, and cards. While color transitions are low-risk for vestibular triggers (no spatial movement), some users with extreme sensitivity report discomfort from any visual change. The current implementation is likely acceptable but should be tested.
3. **Potential future risk:** If the app adds toast notifications, chart animations, page transitions, or skeleton loading screens, these would be vestibular triggers. This persona serves as a guardrail against future regression.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **Reduced motion verification** | Enable `prefers-reduced-motion: reduce` in OS settings. Navigate all 8 routes. | No element moves, slides, scales, or fades. All transitions resolve instantly. Color changes are acceptable. | 2.1-2.2 Motion Testing |
| 2 | **Progress bar under reduced motion** | Enable reduced motion. Upload a CSV file. Observe the progress bar. | Progress bar updates instantly (no smooth width transition). Width jumps from 0% to current % without animation. | 2.2 Testing Protocol |
| 3 | **Page load stability** | Open `/dashboard` with data already loaded. Observe the page for 5 seconds. | No layout shift after initial render. Hero stats, alert banner, and teacher table appear in their final positions immediately. | 2.4 Vestibular Risk |
| 4 | **Print workflow** | Navigate to `/rooms`, find her room, print. Total workflow. | Completable without encountering any motion trigger. Measure: any involuntary eye tracking or discomfort reported. | 2.4 Vestibular Risk |

### Recruitment Criteria

**Screening questions:**
1. "Do you experience migraines, vertigo, or motion sickness triggered by screen animations, scrolling effects, or rapid visual changes?" (Looking for: self-identified vestibular sensitivity)
2. "Do you enable the 'Reduce motion' or 'Reduce animations' setting on your computer or phone?" (Looking for: active use of the preference)
3. "Can you describe a recent experience where a website or app triggered discomfort for you? What specifically caused it?" (Looking for: specific triggers — parallax, sliding, pulsing, flashing)
4. "Do you work in a school or educational setting?" (Looking for: relevant role)
5. "Would you be comfortable telling us during the testing session if something on screen makes you uncomfortable, so we can stop immediately?" (Establishes safety protocol)

**Safety protocol:** Obtain informed consent that specifically mentions screen exposure. Have a plan to stop the session immediately if the participant reports any discomfort. Provide a quiet, dimly lit space for recovery if needed. Never require a participant to push through discomfort.

### Testing Protocol Mapping

- **Audit sections:** 2.1-2.4 (Motion and Animation Testing — all subsections)
- **Critical components:** Upload progress bar, hover transitions, any future animations
- **Critical routes:** `/upload` (progress bar), all routes (hover transitions)

---

## Persona 5: Mr. James Okafor — Department Chair with ADHD

### Identity & Role

- **Title:** Science Department Chair, AP Biology Teacher
- **Experience:** 12 years. Coordinates testing logistics for all 6 biology teachers. Reviews aggregate compliance data and presents readiness reports at department meetings.
- **Context:** He uses the app as a coordinator — he cares about the big picture (are all teachers' rosters complete? are there system-wide compliance gaps?) rather than individual student records. He accesses the dashboard, compliance page, and teacher sheets most frequently.
- **Age:** 41
- **Technical comfort:** High. Power user of Google Workspace, familiar with data dashboards.

### Primary Accessibility Need

**ADHD (Attention-Deficit/Hyperactivity Disorder, combined type).** Mr. Okafor experiences difficulty sustaining focus on data-dense screens, is easily distracted by peripheral visual elements, and struggles to prioritize when presented with too many data points simultaneously. He benefits from: clear visual hierarchy that directs attention, progressive disclosure (summary first, details on demand), strong focus indicators that help him track his position, reduced visual clutter, and clear next-action guidance ("what should I do with this information?").

He does not use assistive technology but has strong preferences about dashboard design learned from years of working around his attention challenges.

### Interaction Patterns

**Primary workflow:**
1. Opens `/dashboard` — scans the hero stats for "anything red" (problems) or "everything green" (fine)
2. If problems exist, reads the alert banner for guidance
3. Opens `/compliance` for the detailed breakdown — looks at charts first (visual), reads tables only if charts flag something
4. Opens `/teachers` to see which specific teacher has incomplete data
5. Sends a follow-up email referencing the teacher's name and the specific gap

**Frequency:** 2-3 times per week during test-prep. Occasional otherwise.

**Most-used routes:** `/dashboard` (40%), `/compliance` (30%), `/teachers` (20%), `/tracker` (10%)

### Accessibility Requirements

- **Clear visual hierarchy:** The most important information (flagged count, readiness percentage) must be visually dominant. Secondary information (room counts, period numbers) must be visually subordinate. He should be able to identify "is there a problem?" within 3 seconds of page load.
- **Visible focus indicators:** When he Tabs through the page and gets distracted (looks away, checks email, answers a question), he needs to immediately re-orient when he returns. The focus ring must be prominent enough to locate on a full-screen dashboard.
- **Progressive disclosure:** The dashboard should provide a summary; clicking through to sub-pages provides detail. He should never need to process 194 student records to answer "are we ready?"
- **Actionable alerts:** The alert banner must tell him (1) what's wrong, (2) how many, and (3) what to do. Vague alerts like "issues found" force him to investigate, which causes task-switching that breaks his focus.
- **Reduced cognitive load in tables:** Table rows should have enough vertical padding and alternating backgrounds that he doesn't lose his row position. Column alignment must be consistent.

### Current Pain Points

1. **Dashboard information density:** The hero stats section has 6 cards, an alert banner, 6 quick links, and a teacher summary table — all visible without scrolling on a large monitor. For Mr. Okafor, this presents as "a wall of numbers." He gravitates to the red flagged card and ignores the rest.
2. **Compliance page length:** The compliance page has 5 stat cards, 2 charts, and 4 data tables. Scrolling through all of it requires sustained attention. He usually gives up after the charts and doesn't reach the teacher summary at the bottom — which is where the actionable information is.
3. **No "next step" guidance:** After seeing "8 missing exit dates," he knows there's a problem but the path to resolution requires him to navigate to the tracker, identify the 8 students, then figure out which teacher to contact. He'd prefer: "8 students missing exit dates → 3 are in Mrs. Rodriguez's class, 5 are in Mr. Thompson's class → contact them."
4. **Focus ring visibility:** The current 2px navy ring is visible on white backgrounds but can be subtle on a busy page. He has lost his focus position multiple times and resorted to clicking with the mouse to re-establish.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **3-second dashboard scan** | Open `/dashboard`. After 3 seconds, look away. Report: "Is there a problem? What is it?" | Correctly identifies (or reports no issues) within the first impression. If he notices the flagged card or alert banner, the hierarchy is working. | 3.1 Compliance Flag Design |
| 2 | **Compliance page task completion** | Open `/compliance`. Find: (a) how many ESOL Level 2 students, (b) which teacher has missing exit dates. Time the task. | Completes both sub-tasks within 90 seconds. If he abandons or gets distracted mid-task, document what pulled his attention. | 3.4 Information Clarity |
| 3 | **Focus recovery** | While navigating `/roster` with keyboard, simulate a 30-second interruption (ask him a question). Then ask him to continue where he left off. | He can re-locate the focus indicator and continue within 10 seconds. If he cannot find the focus position, the ring is too subtle. | 1.4 Focus Management |
| 4 | **Actionable alert interpretation** | Read the compliance alert banner aloud. Ask: "What do you need to do next? Who do you contact?" | He can articulate the action (go to tracker, find the students, contact the relevant teachers). If the alert doesn't provide enough guidance, document the gap. | 3.1 Compliance Flag Design |

### Recruitment Criteria

**Screening questions:**
1. "Do you find it difficult to sustain focus on data-heavy dashboards or spreadsheets? Does your attention tend to drift, especially when scanning large tables?" (Looking for: self-identified attention challenges — they don't need a formal ADHD diagnosis)
2. "When you open a dashboard, what's the first thing you look for? How long do you typically spend on a single page before navigating away?" (Looking for: scanning patterns, short engagement windows)
3. "Have you ever missed important information on a dashboard because there was too much to look at?" (Looking for: cognitive overload experiences)
4. "Do you prefer data presented as charts/graphs or as numbers in tables?" (Looking for: visual processing preferences)
5. "Do you coordinate testing or compliance data for other teachers?" (Looking for: coordinator role that matches this persona's workflow)

### Testing Protocol Mapping

- **Audit sections:** 1.4 (Focus Management), 3.1 (Compliance Flag Design), 3.4 (Information Clarity)
- **Critical components:** Hero stat cards (hierarchy), alert banner (actionability), focus ring (visibility), compliance page (progressive disclosure)
- **Critical routes:** `/dashboard`, `/compliance`, `/teachers`

---

## Persona 6: Mrs. Carmen Vega — Substitute Teacher Who Is Deaf

### Identity & Role

- **Title:** Long-term Substitute Teacher (Biology)
- **Experience:** 2 years as substitute, 0 years with this application. She is covering for a teacher on medical leave and has been asked to proctor a testing room.
- **Context:** She was given the app URL and told to "print your room roster." She has never seen the application before, does not know the terminology (ESOL, ESE, FLEID), and has 15 minutes to figure it out before her proctoring assignment.
- **Age:** 38
- **Technical comfort:** Moderate. Uses standard web apps. Not a power user.

### Primary Accessibility Need

**Deaf (profound bilateral hearing loss since age 4).** Mrs. Vega uses American Sign Language as her primary language and reads English fluently as a second language. She cannot hear audio alerts, video narration, or sonified data. She relies entirely on visual information. She does not use screen reader technology. Her accessibility needs are: all information must be visual (no audio-only content), error messages and status changes must be displayed on screen (not announced via audio), and any help documentation or tooltips must be text-based (no audio/video walkthroughs without captions).

### Interaction Patterns

**Primary workflow (one-time):**
1. Opens the app for the first time
2. Tries to find her room assignment
3. Navigates to `/rooms`
4. Identifies her room and prints the roster
5. Reviews the roster for any special notes about student accommodations

**Frequency:** Once per testing cycle (1-2 times per year). Zero prior experience.

**Most-used routes:** `/rooms` (80%), `/dashboard` (20%)

### Accessibility Requirements

- No audio-only content. Currently the app has none — this is verified.
- Error messages must be displayed visually, not just announced to screen readers. The upload error state currently shows text on screen — this is correct.
- Any video help content (if added in the future) must have captions or a text transcript.
- Terminology must be explained visually. "ESOL", "ESE", "504", "FLEID" are jargon that a substitute may not know.
- First-time user experience must be navigable without training or prior context.

### Current Pain Points

1. **Jargon barrier:** She does not know what "ESOL Level 2" or "ESE — K" means. The badge text is technically readable but semantically opaque. She needs a legend, tooltip, or help panel.
2. **"FLEID" is incomprehensible:** The abbreviation "FLEID" on the roster means nothing to her. She would understand "FL Education ID" or "State ID."
3. **Navigation to room roster:** The 8-item navigation bar requires her to identify "Rooms" as the correct destination. This is reasonably clear, but she might try "Roster" first (which shows all students, not room-specific).
4. **No onboarding:** There is no first-time user guide, help panel, or contextual explanation. She must explore by trial and error, which is stressful under time pressure.
5. **No visual feedback for actions:** Currently, button clicks provide visual feedback (hover color change), and form submissions show loading/success/error states — this is correct. But if any future feature relies on audio feedback (e.g., a "ding" on successful upload), she would miss it.

### Critical Testing Scenarios

| # | Scenario | Task | Success Metric | Protocol Section |
|---|----------|------|---------------|-----------------|
| 1 | **First-time room roster retrieval** | Given only the URL, find and print the roster for Room 177 within 5 minutes. | Successfully prints the correct room roster. Document every misstep and how long each step takes. | 3.4 Information Clarity |
| 2 | **Badge comprehension** | Point to a badge "ESE — K" on the printed roster. Ask: "Do you know what this means? Does this student need anything special during testing?" | If she cannot answer, the badge system needs supplementary explanation for first-time users. | 3.2 Accommodation Badge Clarity |
| 3 | **Error recovery** | Intentionally navigate to the wrong page (e.g., `/compliance`). Can she find her way to `/rooms` without assistance? | Recovers within 60 seconds using visual navigation. | 3.4 Information Clarity |
| 4 | **Terminology comprehension** | Show the roster table. Ask her to identify what "FLEID" means. | If she cannot answer, rename or add a tooltip. | 3.4 Information Clarity |

### Recruitment Criteria

**Screening questions:**
1. "Are you Deaf or hard of hearing?" (Direct — use the participant's preferred terminology)
2. "Do you prefer communication in ASL, written English, or spoken English with lip reading?" (Determines session format — provide an ASL interpreter if needed)
3. "Have you worked as a substitute teacher or proctor in a school setting?" (Looking for: relevant role)
4. "Have you ever used a school data dashboard or student information system? If so, which ones?" (Gauges prior experience)
5. "When websites show error messages or confirmation messages, do you ever miss them? What helps you notice them?" (Understands visual attention patterns)

**Session accommodation:** Provide an ASL interpreter if the participant prefers ASL. All session instructions should be available in writing. Ensure the testing room has adequate lighting for sign communication. Use written or chat-based debriefing if the participant prefers.

### Testing Protocol Mapping

- **Audit sections:** 3.2 (Accommodation Badge Clarity), 3.4 (Information Clarity), 4.1 (Educator Testing — Task Set D: Print)
- **Critical components:** Navigation clarity, badge legend/tooltips, terminology accessibility, print workflow
- **Critical routes:** `/rooms`, `/dashboard`

---

## Recruitment & Testing Guidance

### Recruiting Strategy

| Persona | Where to Recruit | Incentive | Timeline |
|---------|-----------------|-----------|----------|
| Daniel (color blindness) | Faculty at Reagan Doral or partner schools; 8% of males have some form — ask school nurse for referrals (with consent) | $50 gift card + released planning period | 1-2 weeks |
| Dr. Freeman (motor/keyboard) | District testing coordinators; occupational therapy referral networks | $75 gift card | 2-3 weeks |
| Mrs. Delgado (blind/screen reader) | National Federation of the Blind educator network; Florida Division of Blind Services | $100 gift card + travel reimbursement | 3-4 weeks |
| Ms. Tran (vestibular) | Faculty self-identification; neurology clinic referral (with consent); HR accommodation records (with consent) | $50 gift card | 2-3 weeks |
| Mr. Okafor (ADHD) | Faculty self-identification; no formal diagnosis required — recruit based on self-reported attention challenges | $50 gift card | 1-2 weeks |
| Mrs. Vega (Deaf substitute) | District substitute teacher pool; Deaf community organizations; Florida School for the Deaf | $75 gift card + ASL interpreter provided | 3-4 weeks |

### Session Structure by Persona

#### Daniel (Color Blindness) — 30 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Setup | 5 min | Confirm deuteranopia. Enable Chrome color vision simulation for recording purposes. | — |
| Task Set | 15 min | Scenarios 1-4 above. Screen share recorded. | Task completion time, badge identification accuracy, workarounds used |
| Debrief | 10 min | "Which badges were hardest to distinguish?", "Did you ever have to read text to identify a category that a colleague would see by color?" | Qualitative: which design elements rely too heavily on color |

#### Dr. Freeman (Keyboard Only) — 45 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Setup | 5 min | Disconnect mouse. Confirm keyboard-only navigation. | — |
| Task Set | 25 min | Complete full workflow: upload → dashboard → compliance → rooms → print. All keyboard. | Total Tab count per task, time per task, mouse-reach moments (noted as failures) |
| Frustration log | 5 min | "At any point did you want to give up and use the mouse? Where?" | Qualitative: keyboard friction points |
| Debrief | 10 min | "What would make keyboard navigation faster?", "Did you ever lose your place on the page?" | Skip link preference, shortcut requests, focus ring visibility feedback |

#### Mrs. Delgado (Screen Reader) — 60 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Setup | 10 min | Confirm VoiceOver settings. Participant uses her own laptop with her configuration. Navigate to the app. | VoiceOver version, browser, Braille display (if used) |
| Orientation | 5 min | Ask her to explore the dashboard page structure. "Tell me what you can find." | Which landmarks, headings, and regions she discovers. What she misses. |
| Task Set | 30 min | Scenarios 1-4 above. Audio recorded (with consent). | Task completion, navigation strategy, dead ends, missing announcements |
| Structural feedback | 5 min | "How would you describe the page structure?", "Were there areas where you didn't know what section you were in?" | Heading hierarchy gaps, landmark gaps, missing labels |
| Debrief | 10 min | "How does this compare to other school data tools you've used?", "What one thing would you change?" | Comparative assessment, priority fix |

#### Ms. Tran (Vestibular) — 30 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Safety briefing | 3 min | "We will stop immediately if anything on screen causes you discomfort. Please tell us right away — there is no pressure to continue." | Informed consent confirmed |
| Setup | 2 min | Confirm `prefers-reduced-motion: reduce` is enabled. | OS setting verified |
| Task Set | 15 min | Scenarios 1-4 above. Observer watches for: involuntary eye tracking, squinting, looking away from screen. | Motion triggers detected (count and describe), discomfort reports |
| Debrief | 10 min | "Did anything on screen bother you?", "Were there moments where you expected something to move and it didn't?" (tests whether reduced motion caused confusion) | Qualitative: any motion that slipped through, any confusion from missing expected animation |

**Environment:** Dimly lit room. No fluorescent lighting (LED preferred). Screen brightness at 50% or participant's preference. Water available.

#### Mr. Okafor (ADHD) — 45 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Setup | 5 min | No special setup. Note: do not mention ADHD during the session — frame as "dashboard usability testing." | — |
| 3-second scan | 5 min | Scenarios 1 (dashboard scan). Flash the dashboard for 3 seconds, then cover the screen. | First-impression recall accuracy |
| Task Set | 20 min | Scenarios 2-4 above. Note any task abandonment, tangential exploration, or re-reading. | Time per task, task completion, distraction events (counted by observer) |
| Cognitive load assessment | 5 min | "On a scale of 1-5, how overwhelming was the compliance page?", "What would you remove from the dashboard if you could?" | Self-reported cognitive load, simplification requests |
| Debrief | 10 min | "Did the alert banner clearly tell you what to do next?", "Was there any point where you thought 'I don't know where to look'?" | Actionability feedback, hierarchy feedback |

#### Mrs. Vega (Deaf Substitute) — 30 Minutes

| Phase | Duration | Activity | Metrics |
|-------|----------|----------|---------|
| Setup | 5 min | Provide written session instructions. Arrange ASL interpreter if needed. Confirm communication preference. | Communication method noted |
| Task Set | 15 min | Scenarios 1-4 above. All instructions in writing or ASL. | Task completion, missteps, time to first successful print |
| Terminology assessment | 5 min | Show 5 terms: ESOL, ESE, FLEID, 504, "Compliance." Ask her to define each or say "I don't know." | Terminology comprehension score (0-5) |
| Debrief | 5 min | "What would have helped you find your room roster faster?", "Was any text on the page confusing?" | First-time user experience feedback, terminology gaps |

**Environment:** Well-lit room. No background noise (irrelevant but ensures interpreter clarity). Written backup for all instructions.

### Post-Session Analysis Template

After each session, the facilitator completes:

```markdown
## Session Report: [Persona Name] — [Date]

**Participant:** [initials only]
**Persona match:** [confirm which persona they represent]
**Session duration:** [actual time]

### Task Results
| Task | Completed? | Time | Workarounds Used | Notes |
|------|-----------|------|-----------------|-------|

### Accessibility Barriers Found
| Barrier | Severity (Critical/High/Medium/Low) | Component | Route | Recommendation |
|---------|--------------------------------------|-----------|-------|----------------|

### Participant Quotes
- "[verbatim quote relevant to design decisions]"

### Design Recommendations
1. [Ranked by impact]

### Follow-Up Required
- [ ] [specific fix or investigation needed]
```
