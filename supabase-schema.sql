-- ============================================================
-- SFEC Testing Roster System — Supabase Schema
-- Run this in Supabase SQL Editor before starting the app
-- ============================================================

-- Test cycles (one per testing event)
create table if not exists test_cycles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  test_date   text not null,
  subject     text not null default 'Biology',
  school_year text not null default '2025-2026',
  created_at  timestamptz default now()
);

-- Students (one row per student per cycle)
create table if not exists students (
  id                  uuid primary key default gen_random_uuid(),
  cycle_id            uuid not null references test_cycles(id) on delete cascade,
  student_id          text not null,
  fleid               text,
  first_name          text not null,
  last_name           text not null,
  middle_initial      text,
  grade               integer not null,
  birth_date          text,
  course_title        text,
  teacher_name        text,
  class_room          text,
  term                text,
  period              integer,
  student_language    text,
  esol_level          integer,
  esol_exit_date      text,
  ese_exceptionality  text,
  testing_date        text,
  testing_room        text,
  created_at          timestamptz default now()
);

-- Indexes for common query patterns
create index if not exists idx_students_cycle     on students(cycle_id);
create index if not exists idx_students_room      on students(cycle_id, testing_room);
create index if not exists idx_students_teacher   on students(cycle_id, teacher_name);
create index if not exists idx_students_esol      on students(cycle_id, esol_level);
create index if not exists idx_students_ese       on students(cycle_id, ese_exceptionality);

-- RLS: permissive (internal tool, no auth)
alter table test_cycles enable row level security;
alter table students     enable row level security;

create policy "allow all test_cycles" on test_cycles for all using (true) with check (true);
create policy "allow all students"    on students     for all using (true) with check (true);

-- Seed first cycle (matches the CSV you already have)
insert into test_cycles (name, test_date, subject, school_year)
values ('Biology EOC — May 2026', 'May 15, Friday', 'Biology', '2025-2026')
on conflict do nothing;
