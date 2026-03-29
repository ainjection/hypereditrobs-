# HyperEdit - Gumroad Product Listing

---

## PRODUCT TITLE

HyperEdit - Free AI Video Editor with Auto Captions & 1-Click Publishing

---

## SHORT DESCRIPTION (for Gumroad subtitle)

AI-powered video editor. Auto captions, dead air removal, AI animations, stock footage, and one-click publishing to YouTube, TikTok, Instagram, Twitter, and Facebook. Built on FFmpeg. Open source. Runs on Windows, Mac, and Linux.

---

## FULL DESCRIPTION

### Stop paying monthly subscriptions for video editing.

HyperEdit is an AI-powered video editor that runs on your own computer. No cloud. No monthly fees. No limits on exports.

**What you get:**

- Full AI video editor with 6-track timeline
- AI Director that edits your video from text commands ("remove dead air", "add captions", "make it cinematic")
- Auto-caption generator with 6 animation styles (karaoke, fade, pop, bounce, typewriter)
- Dead air removal - automatically cuts silence
- 11 motion graphics templates (lower thirds, CTAs, counters, logo reveals)
- AI-generated custom animations from text descriptions
- Image generation (Fal AI integration)
- Image-to-video, video restyling, background removal
- GIF search and auto-insertion from GIPHY
- Smart scene detection
- YouTube chapter auto-generation
- Stock footage search (Pexels + Pixabay built in)
- Reaction video creator (PiP, side-by-side, top-bottom)
- Video captioning via NCA Toolkit
- Export for YouTube, TikTok, Instagram Reels, Twitter
- **One-click publishing to all platforms via Blotato** (optional paid add-on)

**What powers it:**

- FFmpeg - industry standard video processing
- Remotion - React-based video template engine
- NCA Toolkit - 34 media processing endpoints
- Google Gemini AI - powers the AI editing commands
- Whisper - speech-to-text for captions
- Fal AI - image and video generation
- Docker - runs everything in containers

**Works on:**
- Windows 10/11
- macOS (Intel and Apple Silicon)
- Linux (Ubuntu 22.04+)

**Requirements:**
- 8GB RAM minimum (16GB recommended)
- 10GB free disk space
- Docker Desktop installed
- Internet connection (for AI features)
- Free API keys (Gemini, Fal AI, GIPHY - all have free tiers)

**The only thing that costs extra:**
Blotato ($9/month) if you want the one-click auto-publishing to social media. Everything else is completely free.

---

## WHAT'S INCLUDED IN THE DOWNLOAD

1. **HyperEdit source code** - the full video editor application
2. **NCA Toolkit Docker config** - 34 media processing APIs
3. **Remotion Video Templates** - 8 pre-built video templates
4. **Installation Guide** - step-by-step for Windows and Mac
5. **User Guide** - complete feature walkthrough
6. **Feature Reference** - every feature explained simply
7. **API keys setup guide** - where to get each free key
8. **Example project files** - sample videos to practice with

---

## PRICING SUGGESTION

| Tier | Price | What's included |
|------|-------|----------------|
| Basic | $29 | HyperEdit + install guide + user guide |
| Pro | $49 | Basic + NCA Toolkit + Remotion templates + stock footage integration |
| Ultimate | $79 | Pro + auto-publishing setup + 1-on-1 setup call (30 min) |

Or single tier at $39-49 with everything included.

---

## DELIVERY

After purchase, customer receives:
1. Download link to ZIP file containing everything
2. PDF quick-start guide
3. Access to updates (email notification for new versions)
4. Support via email or Skool community

---

## GUMROAD PRODUCT IMAGES NEEDED

1. **Cover image** (1280x720) - HyperEdit UI screenshot with bold text overlay "AI VIDEO EDITOR - FREE FOREVER"
2. **Feature showcase** (1280x720) - split showing 4 key features: AI Director, Auto Captions, Stock Footage, 1-Click Publish
3. **Before/After** (1280x720) - "15 hours/week manual" vs "0 hours automated"
4. **Tech stack** (1280x720) - logos of FFmpeg, Docker, Remotion, Gemini, NCA
5. **Platform support** (1280x720) - Windows, Mac, Linux logos with checkmarks

---

## INSTALLATION GUIDE (included in ZIP)

### Windows Installation

**Step 1: Install Docker Desktop**
1. Download from docker.com/products/docker-desktop
2. Run installer, follow prompts
3. Restart computer when asked
4. Open Docker Desktop, wait for it to start

**Step 2: Install Node.js**
1. Download from nodejs.org (LTS version)
2. Run installer, click Next through everything

**Step 3: Install FFmpeg**
1. Open Command Prompt
2. Type: winget install Gyan.FFmpeg
3. Close and reopen Command Prompt

**Step 4: Install Python (for Whisper captions)**
1. Download from python.org (3.12+)
2. Tick "Add to PATH" during install
3. Open Command Prompt, type: pip install openai-whisper

**Step 5: Unzip HyperEdit**
1. Extract the ZIP to a folder (e.g. C:\HyperEdit)
2. Open Command Prompt, navigate to folder
3. Type: npm install (wait 2-3 minutes)

**Step 6: Set up API keys**
1. Create .dev.vars file in the HyperEdit folder
2. Add your free API keys (guide included)

**Step 7: Start HyperEdit**
1. Terminal 1: node scripts/local-ffmpeg-server.js
2. Terminal 2: npm run dev
3. Open http://localhost:5173 in browser

**Step 8: Start Docker services (optional)**
1. For NCA Toolkit: docker compose -f docker-compose.standalone.yml up -d
2. For Remotion templates: docker compose up -d

### Mac Installation

**Step 1: Install Homebrew** (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

**Step 2: Install everything**
brew install node ffmpeg python docker

**Step 3-8:** Same as Windows steps 5-8

---

## FAQ FOR LISTING

**Is this really free?**
Yes. HyperEdit itself is free and open source. The AI features use free API tiers. The only optional paid add-on is Blotato ($9/month) for auto-publishing to social media.

**Do I need a powerful computer?**
8GB RAM and any modern processor works. No GPU required. Video rendering uses CPU via FFmpeg.

**Can I use this commercially?**
Yes. Edit videos for clients, your business, or resell the videos you create.

**What if I get stuck?**
The package includes a complete installation guide, user guide, and you can reach out via email for support.

**Is this a subscription?**
No. One-time purchase. You own it forever. Free updates included.

**Does it work offline?**
The editor works offline for basic editing. AI features (captions, animations, image generation) need internet.
