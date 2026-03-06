# Roamera — Product Overview

## What It Is
Roamera is a **coliving discovery platform** for digital nomads. It answers the #1 question nomads have: **"What's the vibe like?"** — something Booking.com, Hostelworld, and Google can't tell you.

## Problem
Digital nomads spend hours across 5+ platforms trying to evaluate coliving spaces. Existing booking sites show rooms and prices but miss what actually matters: WiFi reliability, community atmosphere, workspace quality, and the local scene.

## Target Users
- **Primary:** Digital nomads (remote workers, freelancers) seeking 2-week to 3-month coliving stays
- **Secondary:** Coliving operators wanting free exposure and booking traffic
- **Tertiary:** Travel bloggers and content creators covering the nomad lifestyle

## Core Value Proposition
A purpose-built discovery experience that surfaces the information nomads actually care about — fast WiFi, real community reviews, workspace quality, neighborhood vibe — presented beautifully and honestly.

## Revenue Model
- Booking.com affiliate links (25-40% commission via Awin)
- Future: premium listings for operators, sponsored placements

## Tech Stack (Production)
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS v3 + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Hosting:** Vercel
- **CMS:** Builder.io Gen 1 SDK
- **Domain:** roamera.co (Cloudflare DNS)

## This Concept
The "Waves & WiFi" concept is the **design reference** — static HTML/CSS pages that define how Roamera should look and feel. These are the source of truth for the design system, component patterns, and page layouts that the production React app must match.

## Concept Pages
- `index.html` — Listing page (single coliving detail view)
- `homepage.html` — Homepage with hero, search, city cards, featured spaces
- `waves-wifi-booking.html` — Booking.com style variant
- `waves-wifi-hostelworld.html` — Hostelworld style variant
- `waves-wifi-current.html` — Current production site comparison
- `intel.html` — Data audit/inspector view
- `/listings/` — 89 generated listing pages from real data
