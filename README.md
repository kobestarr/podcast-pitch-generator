# Podcast Guest Pitch Generator

AI-powered tool to generate personalized podcast guest pitch emails that actually get replies.

## Overview

A single-page generator that creates 3 customized pitch emails based on user inputs:
- **Pitch 1**: Direct & Professional
- **Pitch 2**: Social Proof & Value Exchange  
- **Pitch 3**: Casual & Mobile

Plus 3 follow-up templates for ongoing outreach.

## Features

- ✅ Multi-step form with real-time pitch strength score
- ✅ AI-generated personalized pitches (Claude 3.5 Sonnet)
- ✅ Email capture with GHL integration
- ✅ Retargeting pixels (Meta + LinkedIn)
- ✅ Mobile responsive design
- ✅ DealFlow brand styling

## Quick Start

```bash
# Clone the repo
git clone https://github.com/kobestarr/podcast-pitch-generator.git
cd podcast-pitch-generator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit `http://localhost:3000` to use the generator.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `GHL_API_KEY` | Go High Level API key | Yes |
| `GHL_LOCATION_ID` | GHL location ID for contacts | Yes |
| `NEXT_PUBLIC_META_PIXEL_ID` | Facebook Pixel ID | No |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag | No |

## Project Structure

```
podcast-pitch-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main generator page
│   │   ├── layout.tsx            # Root layout + pixels
│   │   └── api/
│   │       └── generate/         # AI generation endpoint
│   ├── components/
│   │   ├── FormFields/          # Form input components
│   │   └── PitchScore.tsx       # Live strength meter
│   └── lib/
│       └── ai.ts                 # AI provider abstraction
├── public/
│   └── cheatsheet.pdf           # Podcast Research Cheat Sheet
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Implementation Slices

| Slice | Deliverable | Status | Key Features |
|-------|-------------|--------|-------------|
| 1 | Static Form UI | ✅ Done | Multi-step form, field validation |
| 2 | Live Pitch Score | ✅ Done | Real-time scoring, progress indicator |
| 3 | API + AI Generation | ✅ Done | **Pitches visible!** AI generation working |
| 4 | Results Display | 🔄 In Progress | Polish UX, download, formatting |
| 5 | Email Capture + Unlock | ⏳ Next | **GHL Integration** - Database/CRM |
| 6 | Retargeting + Analytics | ⏳ Next | Pixel tracking, analytics |
| 7 | CTAs + Email Delivery | ⏳ Next | Email sending, automation |
| 8 | Final QA + Launch | ⏳ Next | Final polish, launch prep |

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Email**: GHL API
- **Analytics**: Meta Pixel, LinkedIn Insight Tag
- **Hosting**: Vercel

## License

MIT - See LICENSE file.

## Credits

Built by DealFlow Media
