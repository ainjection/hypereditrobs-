# ClipWise — Complete User Guide

---

## Table of Contents

1. [Starting the App](#1-starting-the-app)
2. [Interface Overview](#2-interface-overview)
3. [Importing & Managing Assets](#3-importing--managing-assets)
4. [The Timeline](#4-the-timeline)
5. [Clip Properties Panel](#5-clip-properties-panel)
6. [Caption Properties Panel](#6-caption-properties-panel)
7. [The Director (AI Chat)](#7-the-director-ai-chat)
8. [Recipes — One-Click Pipelines](#8-recipes--one-click-pipelines)
9. [Director Workflows — Complete Reference](#9-director-workflows--complete-reference)
10. [Picasso — Image Generation](#10-picasso--image-generation)
11. [DiCaprio — Video Effects](#11-dicaprio--video-effects)
12. [Exporting Your Video](#12-exporting-your-video)
13. [Tips & Keyboard Shortcuts](#13-tips--keyboard-shortcuts)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Starting the App

You **must** run two processes simultaneously every session. Open two separate terminals:

**Terminal 1 — Vite dev server (the UI):**
```bash
cd /path/to/hyper
npm run dev
```
Open `http://localhost:5173` in your browser.

**Terminal 2 — FFmpeg processing server (all video work happens here):**
```bash
export PATH="/c/Program Files/nodejs:/c/Users/clawb/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin:$PATH" && node scripts/local-ffmpeg-server.js
```

> If you see errors about FFmpeg not found, the PATH export is wrong. If you see "session not found" errors in the UI, restart the FFmpeg server — it may have crashed.

The FFmpeg server runs on port **3333**. It handles all transcription, rendering, processing, and AI calls. The Vite server on port **5173** only serves the UI.

---

## 2. Interface Overview

```
┌──────────────────┬─────────────────────────┬────────────────────┐
│  LEFT PANEL      │   VIDEO PREVIEW         │  RIGHT PANEL       │
│                  │                         │                    │
│  [Asset Library] │   ┌───────────────┐     │  [Director] tab    │
│  ─ Videos        │   │               │     │  [Picasso]  tab    │
│  ─ Images        │   │  Video canvas │     │  [DiCaprio] tab    │
│  ─ Audio         │   │               │     │                    │
│  ─ Animations    │   └───────────────┘     │  AI chat / tools   │
│                  │   [▶ Play] [■ Stop]     │                    │
│  [Properties]    │   [⏱ Time] [↕ Aspect]  │                    │
│  ─ Clip props    │                         │                    │
│  ─ Caption props │                         │                    │
└──────────────────┴─────────────────────────┴────────────────────┘
│  TIMELINE TABS   [Main] [+ Add Tab]                             │
│─────────────────────────────────────────────────────────────────│
│  T1  ████████ caption ████ caption ████                         │
│  V3  ░░░░░░░░░░░░[b-roll]░░░░░░░░░░░░░░░                       │
│  V2  ░░░░░░░░░░[animation]░░░░░░░░░░░░░                         │
│  V1  ███████████████████ base video ████████████████            │
│  A1  ░░░░░░░░░░░░░░░░[audio]░░░░░░░░░░░░░░░░░░                 │
│  A2  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                 │
└─────────────────────────────────────────────────────────────────┘
```

### Panel resizing
All three main panels are resizable. Drag the vertical dividers between panels left/right to give more space to whichever area you need. The timeline height is also adjustable — drag the horizontal bar above it.

### Track guide

| Track | Purpose | What goes here |
|-------|---------|----------------|
| **T1** | Captions | Auto-populated by the transcription workflow. Do NOT drag videos/images here. |
| **V3** | Top overlay | B-roll images. Small scale by default (20%). |
| **V2** | Middle overlay | AI-generated Remotion animations and GIF overlays. |
| **V1** | Base video | Your main footage. Always put the primary video here. |
| **A1** | Primary audio | Audio extracted from video (split audio workflow). |
| **A2** | Secondary audio | Background music or secondary audio. |

### Timeline awareness bar
A bar at the bottom of the timeline shows live stats about your project:
- **Video duration** (MM:SS)
- **Caption count** (blue)
- **Animation count** (purple)
- **GIF count** (green)
- **B-roll count** (amber)
- **A1 audio** indicator (yellow dot)
- *"video only · no edits yet"* if nothing has been added

---

## 3. Importing & Managing Assets

### Uploading a video
Drag a video file from your computer onto the **Asset Library** (left panel) or directly onto the **V1 track** in the timeline. Accepted formats: MP4, MOV, WebM, and other common formats.

After upload:
- A thumbnail is auto-generated and shown in the library
- The asset's duration is detected and stored
- The video is copied into the session's working directory on disk

### Dragging to the timeline
- Drag any asset from the library onto any track in the timeline
- The clip is placed at approximately the position you drop it (snapped to the timeline's time scale)
- Videos and audio default to their natural duration
- Images default to **5 seconds** duration

### Asset types
| Type | Icon | Notes |
|------|------|-------|
| Video | Film icon | Shows thumbnail, streams directly |
| Image | Image icon | 5s default, can be resized |
| Audio | Music note | Waveform displayed |
| Animation | Sparkles | AI-generated Remotion renders |

### Previewing an asset
Click any asset in the library to preview it in the video canvas without adding it to the timeline.

### Deleting an asset
Select it in the library and press **Delete**, or use the trash icon.

---

## 4. The Timeline

### Playing and scrubbing
- Click **▶ Play** (or press Space) to play from the playhead
- Click **■ Stop** to return to the beginning
- Click anywhere on the **time ruler** (the bar at the top of the timeline) to jump to that time
- Drag the **orange playhead arrow** to scrub through the video

### Selecting clips
Click any clip to select it. The selected clip highlights and its properties appear in the bottom-left panel. The video preview jumps to that clip's start time.

### Moving clips
Click and drag a clip left or right to change its start time. You can also drag it to a different track row (e.g., move something from V2 to V3). The timeline saves automatically when you release.

### Trimming clips (in/out points)
Drag the **left or right edge** of a clip to trim it:
- Dragging the **left edge** inward moves the in-point forward (cuts the start)
- Dragging the **right edge** inward moves the out-point backward (cuts the end)
- The underlying source file is NOT modified — trimming is non-destructive

> Note: If you've done a dead-air removal, the source file IS modified in-place. Trimming after that still works normally.

### Splitting a clip
Select a clip, position the playhead where you want the split, then click the **scissors icon** (✂) in the timeline toolbar. The clip is split into two independent clips at that point.

- Guard: Won't split if the playhead is within **50ms** of either clip edge (too small to be useful)

### Deleting a clip
Select it and press **Delete / Backspace**, or click the **trash icon** in the toolbar.

### Auto-Snap (Ripple Delete)
The **chain-link icon** in the timeline toolbar toggles **Auto-Snap** mode (orange = on):

- **ON**: When you delete a clip, all subsequent clips on the same track shift backward to fill the gap. Useful for keeping edits tight.
- **OFF**: Deleting leaves a gap. Other clips stay put.

### Zooming
Use the **+ / −** zoom buttons in the timeline toolbar. Zoom range is 0.25× to 4×. The time ruler updates automatically (showing 1s intervals at high zoom, up to 60s intervals at low zoom).

### Timeline tabs
The **[Main]** tab holds your primary edit. Click **[+ Add Tab]** to create additional timeline tabs — useful for editing individual animations in isolation. The Director can open animations in a new tab via the "Edit in new tab" button on animation messages.

---

## 5. Clip Properties Panel

When you select any non-caption clip (video, image, GIF, animation) on the timeline, its properties appear in the **bottom-left panel**.

### Scale
Slider range: **0.1× to 3.0×** (step 0.05)
- 1.0 = original size (100%)
- Values below 1.0 shrink the clip (e.g., B-roll images default to 0.2 = 20% width)
- Values above 1.0 enlarge (use for digital zoom effects)
- Shown as a percentage: "150%"

### Position (X / Y)
Two numeric inputs in pixels:
- **X**: Horizontal offset from center. Negative = left, positive = right.
- **Y**: Vertical offset from center. Negative = up, positive = down.
- Default: 0, 0 (centered)
- Off-screen positioning (e.g., Y = -500) makes a clip invisible in the render — useful for hiding clips you're not ready to use

### Rotation
Slider: **-180° to +180°** (step 1°)
- 0° = no rotation
- Positive = clockwise, negative = counter-clockwise

### Crop (Top / Bottom / Left / Right)
Four inputs, each **0–50%**:
- Removes that percentage from each edge
- Example: Left=25% removes the left quarter of the frame
- Non-destructive — source file not changed

### Reset All
Resets scale to 1.0, position to 0/0, rotation to 0°, and all crop to 0%.

---

## 6. Caption Properties Panel

When you select a clip on the **T1 track**, the caption properties appear instead of clip properties.

### Font Family
8 options: **Inter, Roboto, Poppins, Montserrat, Oswald, Bebas Neue, Arial, Helvetica**
- Inter and Roboto are clean/modern
- Poppins and Montserrat are bold and trendy
- Oswald is narrow/condensed
- Bebas Neue is all-caps display style

### Font Size
Slider: **24px – 96px** (step 2px). Shown as live value.

### Font Weight
Three buttons (mutually exclusive): **Normal, Bold, Black**
- Black is the heaviest (900 weight) — good for captions that need to pop

### Text Color
Color picker for the main caption text color.

### Stroke Color & Width
- **Stroke Color**: Outline color around letters
- **Stroke Width** slider: 0–6px
- Stroke at 2–3px with a contrasting color (e.g., white text + black stroke) dramatically improves readability on varied backgrounds

### Position
Three buttons: **Top, Center, Bottom**
- Positions the caption block vertically on the canvas
- Most content uses Bottom

### Animation Style
6 options:
- **None**: Static — caption appears and disappears instantly
- **Karaoke**: Words are highlighted in sequence as they're spoken. The highlight color picker appears when this is selected.
- **Fade In**: The caption chunk fades in smoothly
- **Pop**: Caption pops in with a quick scale-up effect
- **Bounce**: Bounces into place
- **Typewriter**: Letters appear one by one

### Highlight Color (Karaoke only)
Color picker — default is gold (#FFD700). This is the color that "lights up" each word as it plays. Try bright colors: yellow, cyan, orange.

### Time Offset
Slider: **-5s to +5s** (step 0.1s)
- If captions are consistently appearing too early, drag toward "Later" (+)
- If consistently too late, drag toward "Earlier" (−)
- This is a global shift applied to all word timestamps for this clip
- Useful when Whisper mis-aligns with the actual audio

---

## 7. The Director (AI Chat)

The **Director** is the primary AI panel on the right side. Type what you want done in plain English — it identifies your intent and routes to the correct workflow automatically.

### The input toolbar (above the text box)

#### ⚡ Recipes
Opens a scrollable list of 8 multi-step presets. Click any recipe to run its full pipeline (see [Section 8](#8-recipes--one-click-pipelines)).

#### ✦ Quick Actions
Opens a popover with two sections:
1. **Suggestions** — 12 common prompts with icons. Click any to fill the input box:
   - Add captions, Remove dead air, Remove background noise, Speed up by 1.5x, Add GIF animations, Add B-roll images, Cut at chapters, Create demo animation, Animate transcript, Add 5 animations, Add Ken Burns zoom, Extract audio to A1
2. **Saved** (amber chips) — Your bookmarked prompts (up to 8). Click to re-run, × to delete.

#### ⏱ Time Range
Lets you scope a command to a specific portion of the video. After clicking, a time range picker appears. You can type ranges like:
- `0:10 - 0:45` (minutes:seconds format)
- `10s - 45s` (seconds format)
- `at 0:30` (creates a window 2s before and 5s after)
- `from 0:30` (from that point, 10s window)

The selected range appears as a **blue tag** above the input with a timer icon. Clear it with ×.

**Most useful for:** Contextual animations ("animate this section"), targeted FFmpeg edits ("speed up this part").

#### @ Reference
Lets you attach a specific asset, clip, track, or timestamp as context for the AI. Click @ then select from the picker. Selected references appear as **orange tags** above the input.

**Most useful for:** "Apply this effect to @my-clip.mp4" so the AI knows exactly which asset you mean.

#### Platform Export (globe icon)
Opens the platform re-encoding picker. See [Platform Export](#platform-export).

### Saving prompts
Hover over any **message you sent** in the chat — a bookmark icon (★) appears. Click it to save that prompt to your Quick Actions. The time range and @ reference prefixes are automatically stripped before saving so the saved version is reusable in any context.

### The chat history
Messages persist for the current browser session. You can scroll up to see all previous commands and their results. Clicking an "Apply Edit" button on an older message re-runs that FFmpeg command.

---

## 8. Recipes — One-Click Pipelines

Click **⚡ Recipes** to access pre-built editing pipelines. Each runs its steps in sequence — each step completes before the next begins. A progress counter shows which step is running.

| Recipe | Steps | Best for |
|--------|-------|---------|
| **YouTube-Ready** | Dead air → Captions → Chapters → 5 animations | Standard upload with full production value |
| **Podcast Polish** | Dead air → Extract audio → Captions | Talking head / podcast with clean audio separation |
| **Social Clip** | Dead air → Captions → GIF overlays | Short-form content for Instagram, LinkedIn, etc. |
| **Tutorial** | Dead air → Captions → Chapters → 4 step animations | Step-by-step how-to videos |
| **Talking Head** | Dead air → Captions → Extract audio | Simple presenter with clean audio track |
| **Viral Short** | Dead air → GIF overlays → Captions | Reaction-style TikTok/Shorts content |
| **Interview** | Dead air → Captions → Chapters | Q&A / conversation / podcast video |
| **Product Demo** | Captions → 5 animations → Chapters | Feature walkthroughs, SaaS demos |

### How recipes handle the confirm step
Dead air removal normally shows a confirm card before processing. Inside a recipe, steps run automatically without the confirm gate — the recipe itself is your consent.

### If a recipe step fails
The pipeline stops at the failed step and shows the error. You can then fix the issue and run subsequent steps individually.

---

## 9. Director Workflows — Complete Reference

### Dead Air Removal

**What to type:** "Remove dead air" / "Remove silence" / "Cut out the gaps" / "Remove pauses"

**What it does:**
FFmpeg scans the audio for silence (threshold: -26dB, minimum duration: 0.4s). Every non-silent segment is extracted individually and then concatenated together. The result replaces your original V1 file in-place on disk.

**Confirm step:** A card appears before processing showing:
- What will happen ("I'll detect and remove silent periods from your video")
- Details (threshold, minimum silence length)
- **Proceed** / **Cancel** buttons

**After processing:**
- The V1 clip's duration updates to the new (shorter) length
- The chat reports: original duration, new duration, and how many seconds were removed
- The video asset auto-refreshes with a new cache-busted URL

**Settings:** Silence threshold = -26dB, minimum silence = 0.4s (hardcoded — can't be changed in UI)

**Important:** This permanently modifies the file on disk. There is no undo for dead air removal. Make a copy of your original file before running this if you want to keep it.

---

### Captions

**What to type:** "Add captions" / "Transcribe my video" / "Add subtitles"

**What it does:**
1. A style picker appears — configure your caption look before processing
2. Click **"Add Captions"** to start transcription
3. The V1 clip is sent to local Whisper (or Gemini for videos under ~2 minutes)
4. Word-level timestamps are returned
5. Words are grouped into caption chunks and placed on T1

**Chunking rules:**
- Max **5 words** per caption chunk
- A **0.7-second pause** between words always starts a new chunk, even if under 5 words
- Each chunk becomes a separate clip on T1

**Style options (set before transcribing):**
- **Font Family**: 8 choices (Inter, Roboto, Poppins, Montserrat, Oswald, Bebas Neue, Arial, Helvetica)
- **Highlight Color**: Used when animation = "Karaoke"

**After transcribing**, select any T1 clip to edit further style in the Caption Properties panel (font size, weight, stroke, position, animation style, time offset).

**Caption style is remembered** across sessions — your last settings are automatically restored.

**Undo:** The ↩ Undo button appears on the caption message. Click it to remove all caption clips added in that batch.

**If captions appear out of sync:**
Select the T1 clip and adjust the **Time Offset** slider in the Caption Properties panel. Drag toward "Later" if captions appear too early, "Earlier" if too late.

---

### Caption Polish (Filler Word Removal from Display)

**What to type:** "Polish captions" / "Remove filler words" / "Clean up the captions" / "Remove um and uh"

**What it does:**
Instantly removes filler words from the **caption display only** — the audio is NOT affected. Words are deleted from the word list for each T1 clip.

**Filler words removed:** um, uh, hmm, hm, mhm, uh-huh, like, basically, literally, actually, right, okay, ok, so, well, you know, I mean

**Requirements:** Captions must already be on the T1 track.

**Result:** The chat reports how many words were removed. The caption clips update immediately — no re-transcription needed.

---

### Filler Word Audio Muting

**What to type:** "Mute filler words in the audio" / "Silence the ums and uhs" / "Cut um from audio" / "Clean speech"

**What it does:**
Silences the audio at every filler word moment. The video frames are completely untouched — only the audio volume is zeroed out at those precise timestamps. The result is much less jarring than cutting the clip entirely — there's a brief moment of silence instead of a jump cut.

**Requirements:** Captions must already be on the T1 track (filler word timestamps come from the caption data).

**Uses the same filler word list** as Caption Polish above.

**How it works:**
1. Finds all filler words across all T1 caption clips
2. Converts word start/end times to absolute timeline positions
3. Adds ±50ms padding around each word
4. Builds an FFmpeg volume filter that zeros the audio for each segment
5. Re-encodes audio only (`-c:v copy`) — video stream is untouched

**Tip:** Run Caption Polish first (removes fillers from display), then Filler Word Audio Muting (silences them in the audio) for a fully clean result.

---

### Extract Audio

**What to type:** "Extract the audio" / "Split audio to A1" / "Separate the audio track" / "Mute the video, put audio on A1"

**What it does:**
Splits your V1 video into two assets:
1. A **muted video** (replaces the V1 clip — same video, no sound)
2. An **audio-only file** (placed on the A1 track at the same start time)

This is useful when you want to:
- Add background music under narration without the original audio competing
- Process the audio independently (e.g., apply noise reduction to just the audio file)
- Use the separated audio track for mixing

**Confirm step:** A card appears before processing. Click **Proceed** to continue.

**After processing:**
- V1 clip now references the muted video
- A1 gets a new audio clip

**Undo:** The ↩ Undo button appears. Click it to restore the original V1 video and remove the A1 clip.

---

### Audio Clean (Noise Reduction)

**What to type:** "Clean the audio" / "Remove background noise" / "Reduce the hiss" / "Denoise" / "Fix the room noise"

**What it does:**
Applies two FFmpeg audio filters in sequence:
1. **High-pass filter** at 80Hz — removes low-frequency rumble and hum
2. **afftdn** (spectral noise reduction) at -25dB — removes broadband noise like room echo, fan noise, HVAC

The result replaces the asset in-place. **Instant — no AI call needed.**

**Best for:** Recordings with consistent background noise (fan hum, room tone, AC noise). Less effective on voices recorded in echo-y spaces.

---

### Audio Normalize

**What to type:** "Normalize the audio" / "Fix the audio levels" / "Too quiet" / "Audio is too loud" / "Set to -16 LUFS"

**What it does:**
Applies EBU R128 loudness normalization targeting **-16 LUFS** with a true peak of -1.5 dBTP. This is broadcast/streaming standard. Quiet recordings are amplified, loud recordings are attenuated.

**Instant — no AI call needed.**

**Best for:** Videos where the speaker sounds too quiet or inconsistent between cuts.

---

### Chapter Cuts

**What to type:** "Cut at chapters" / "Split into sections" / "Divide by topic" / "Add chapter points"

**What it does:**
1. Builds a transcript of your video (uses existing captions if available — much faster, skips Whisper)
2. Sends transcript to Gemini to identify topic-based chapters
3. Splits the V1 clip at each chapter boundary

**After processing:**
- The chat shows a numbered chapter list with timestamps and titles
- The V1 track now has multiple clips (one per section)
- A YouTube chapters text block is shown — ready to paste into your video description

**Smart mode:** If you already have captions on T1, the existing word timestamps are used to build the transcript. No re-transcription = much faster processing.

**Output example:**
```
1. 0:00 - Introduction
2. 0:45 - Problem Overview
3. 2:10 - The Solution
4. 4:30 - Live Demo
5. 6:15 - Pricing & Plans
```

---

### Scene Detection

**What to type:** "Detect scene changes" / "Find where the cuts are" / "Scene detect" / "Find scene changes"

**What it does:**
FFmpeg scans every frame for visual scene changes (frame-to-frame difference threshold: 30%). Returns a list of timestamps where new scenes begin.

**Workflow:**
1. Director scans the video and shows a result card in the chat
2. The card lists all detected scene timestamps
3. Click **"Cut at N scenes"** to split V1 at every detected point

**Deduplication:** Any two detected scenes within 1.5 seconds of each other are merged (avoids noisy micro-detections from transitions/effects).

**Best for:** Footage that was already edited (e.g., a screen recording with hard cuts between topics, a highlight reel, a video with title cards).

**Note:** A threshold of 30% means moderate scene changes are detected. Very subtle cuts (dissolves, slow transitions) may not be picked up.

---

### GIF Overlays (Auto-GIF)

**What to type:** "Add GIF overlays" / "Find GIFs for my video" / "Add reaction GIFs" / "Add meme GIFs"

**What it does:**
1. Transcribes your video to extract keywords
2. Searches GIPHY for GIFs matching each keyword
3. Downloads the GIFs and places them on the V2 track at the relevant timestamps

**Result:** Multiple GIF clips appear on V2 timed to match what's being said.

**After:** Select any GIF clip and use the Clip Properties panel to resize/reposition it.

**Undo:** The ↩ Undo button removes all GIF clips added in that batch.

---

### B-roll Images

**What to type:** "Add B-roll" / "Add stock images" / "Add visual context" / "Generate B-roll"

**What it does:**
1. Transcribes your video (uses captions if available — skips Whisper)
2. Extracts content keywords using Gemini
3. Generates relevant AI images via fal.ai
4. Places images on V3 as small overlays (default scale: 20%, centered)

**After:** Select any B-roll clip and adjust Scale in Clip Properties to make it larger or smaller. Default position is centered — move with X/Y inputs.

---

### Batch Animations

**What to type:** "Add 5 animations" / "Add animations throughout the video" / "Generate 3 highlight animations" / "Add animations at each chapter"

**What it does:**
Analyses your video content and generates multiple Remotion animations spread across the timeline:
- **Intro** animation near the start
- **Highlight** animations at key content moments
- **Transition** animations at cuts
- **Callout** animations for important points
- **Outro** animation near the end

**Storyboard preview:** Before any animations are applied, a preview card shows all proposed animations as a grid:
- Thumbnail image
- Title and type (intro/highlight/etc.)
- Duration and start time

Click **"Apply X animations"** to add them all to V2, or dismiss to cancel.

**Count:** Include a number in your prompt — "add 5 animations" creates 5. Default is 5 if no number is given.

**After applying:** ↩ Undo removes all animations from that batch.

---

### Create Animation (Single)

**What to type:** "Create an intro animation about [topic]" / "Add a title card saying [text]" / "Make an outro animation" / "Design an infographic showing [data]"

**What it does:**
Sends your description to Gemini, which writes a full Remotion scene specification. The FFmpeg server renders it as a video file, which is placed on V2.

**After rendering:**
- The animation appears in the chat with a thumbnail
- An **"Edit in new tab"** button opens the animation in an isolated timeline tab for further editing
- An **"Edit animation"** workflow triggers if you describe changes while the animation clip is selected

**Be specific for best results:** Instead of "add an animation", try "Create a stats animation showing 3 key metrics: 2M users, 98% satisfaction, $50M ARR. Dark background, white text, orange accents."

---

### Edit Existing Animation

**What to type:** Describe the change while an AI animation clip is selected, OR while in an animation's edit tab.

Examples:
- "Make the text larger"
- "Change the background to dark blue"
- "Add a subtle particle effect"
- "Replace the icons with emojis"
- "Make it 3 seconds shorter"

**What it does:**
Sends your edit instruction along with the original Remotion source code to Gemini, which modifies the code and re-renders. The same asset ID is reused — the clip on V2 updates in-place.

**Triggers automatically** when:
1. You have an AI animation clip **selected** on the main timeline and describe a change, OR
2. You're in an **animation edit tab** (any prompt goes to edit mode)

---

### Contextual Animation

**What to type:** (With a time range selected via ⏱) "Make an animation for this section" / "Add a highlight animation here" / "Create a visual for this part"

**What it does:**
Analyses the actual video content within your selected time range — what's being said, what's on screen — and creates a contextually relevant animation. If you're discussing pricing in that section, it might generate a pricing comparison animation.

**Requires a time range** to be set first (click ⏱ before typing). The animation is placed at the start of that range.

---

### Transcript Animation (Kinetic Typography)

**What to type:** "Animate the transcript" / "Create kinetic typography" / "Animate the words from my speech"

**What it does:**
Creates a word-by-word animated text overlay synced to your speech timing. Each word animates in as it's spoken.

---

### Section Resequencing

**What to type:** "Move the pricing section before the demo" / "Swap the intro and the tutorial section" / "Rearrange so the conclusion comes first"

**What it does:**
1. Uses your existing caption data to build a timestamped transcript
2. Sends your instruction and the transcript to Gemini
3. Gemini identifies the sections you named and returns their timestamps
4. A preview card shows the proposed move(s)
5. Click **"Apply resequence"** to physically swap the V1 clip positions

**Requirements:** Captions must be on T1 — this is how the AI knows what content is in each section.

**Preview card shows:**
- The section being moved and its current timestamp range
- Where it's being moved to
- An "Apply resequence" button and a "Cancel" button

**Tip:** Be specific about section names. The AI matches based on what's being said in your video — use terms that actually appear in your speech.

---

### Platform Export

**What to type:** "Export for TikTok" / "Optimize for YouTube" / "Format for Instagram Reels" / OR click the **globe icon** above the chat input

**What it does:**
Re-encodes your video to the platform's technical specifications:
- Scales to correct resolution
- Pads with black bars if aspect ratio doesn't match
- Applies loudness normalization to platform standard

| Platform | Resolution | Aspect Ratio | Loudness | Use for |
|----------|-----------|--------------|----------|---------|
| **YouTube** | 1920×1080 | 16:9 | -16 LUFS | Standard uploads |
| **TikTok / Shorts** | 1080×1920 | 9:16 | -14 LUFS | Vertical short-form |
| **Instagram Reels** | 1080×1920 | 9:16 | -14 LUFS | Reels |
| **Instagram Square** | 1080×1080 | 1:1 | -14 LUFS | Feed posts |
| **Twitter / X** | 1280×720 | 16:9 | -14 LUFS | Tweets |

**Process:** The FFmpeg command is generated and shown in the chat. Click **Apply Edit** to run it. The encode uses H.264 with CRF 18 (high quality) and 192kbps AAC audio.

---

### FFmpeg Edit (General Video Manipulation)

**What to type:** Anything that doesn't match the above workflows — trim, colour, speed, effects, etc.

Examples:
- "Speed up by 1.5x"
- "Slow down to 50%"
- "Increase brightness by 20%"
- "Crop to a 16:9 ratio"
- "Add a fade in at the start"
- "Add a fade out at the end"
- "Rotate 90 degrees clockwise"
- "Mirror horizontally"
- "Apply a vignette effect"
- "Convert to black and white"
- "Boost saturation"
- "Stabilize the footage"
- "Compress to reduce file size"

**What happens:**
1. Your prompt is sent to Gemini along with your video's metadata
2. Gemini returns an FFmpeg command
3. The command appears in the chat with an explanation
4. Click **"Apply Edit"** to run it

**The Apply Edit button shows three states:**
- **Orange "Apply Edit"** — ready to run
- **Spinner + "Applying edit... (this may take a minute)"** — processing
- **Green "✅ Edit Applied"** — done (badge persists on the message)

**Important:** FFmpeg edits replace the source file in-place. There is no undo for FFmpeg edits.

---

### Project Audit

**What to type:** "Audit my video" / "What's wrong with my project?" / "Give me feedback" / "Rate my edit" / "How does it look?"

**What it does:**
Instantly analyses your current timeline state without any AI call. Returns a list of findings with severity levels:

| Level | Color | Meaning |
|-------|-------|---------|
| ⚠ Warning | Orange | Something's missing or wrong |
| ℹ Info | Blue | A suggestion or recommendation |
| ✓ Good | Green | Something done well |

Examples of what it checks:
- No captions added
- No animations on V2
- No audio normalization done
- Timeline is mostly empty
- No B-roll or GIFs
- Video is very long (recommend chapters)
- Audio is on A1 correctly

Some findings have a **one-click fix button** — e.g., "Add captions" appears next to a "no captions" warning.

---

## 10. Picasso — Image Generation

The **middle tab** of the right panel.

Type a description of the image you want. Picasso uses fal.ai's nano-banana-pro model to generate it. Generated images appear in the Asset Library and can be dragged onto any timeline track.

**Examples:**
- "A cinematic aerial view of a city at sunset"
- "A minimalist product photo of a smartphone on white background"
- "A vibrant illustration of a person coding at a desk"

---

## 11. DiCaprio — Video Effects

The **right-most tab** of the right panel. Three distinct tools:

### Animate Image (Kling v1.5)
Takes a still image from your library and generates a short video with realistic motion from it. Great for making product shots, portraits, or illustrations come to life.

**Steps:**
1. Select an image from your library
2. Describe the motion you want ("gentle zoom in", "camera slowly pans right", "fabric blowing in wind")
3. Wait for generation — this takes 30–90 seconds

### Restyle Video (LTX-2 19B)
Applies a style transfer to your video. Changes the visual aesthetic while keeping the motion and composition.

**Examples of style prompts:**
- "Anime style"
- "Oil painting"
- "Cinematic film grain"
- "Neon cyberpunk"

### Remove Background (Bria)
Removes the background from a video, leaving only the subject. The output has a transparent/green background suitable for compositing.

---

## 12. Exporting Your Video

Click the **Export / Render** button (download icon) in the video preview area.

**What the render does:**
- Composes all tracks into a single video:
  - V1 base video
  - V2 overlays (animations, GIFs) — composited over V1
  - V3 overlays (B-roll images) — composited over V2
  - T1 captions — rendered as text over the video
  - A1/A2 audio — mixed with the V1 video's own audio
- Outputs an MP4 file

**Render time** depends on video length and overlay complexity. A 5-minute video with 3 overlays typically takes 2–5 minutes.

**The rendered file** is saved to the session's renders directory on the server. A download link appears in the UI when complete.

---

## 13. Tips & Keyboard Shortcuts

| Key / Action | What it does |
|---|---|
| **Space** | Play / pause |
| **Delete / Backspace** | Delete selected clip |
| **Click time ruler** | Jump playhead to that time |
| **Drag playhead** | Scrub through video |
| **Drag clip edges** | Trim in/out points |
| **Drag clip** | Move clip or change its track |
| **Click ✂** | Split clip at playhead |
| **Click ⛓** | Toggle Auto-Snap (ripple delete) |
| **Click + / −** | Zoom timeline in/out |

### Workflow order recommendations

**For polished talking-head videos:**
1. Dead air removal (removes pauses)
2. Add captions
3. Caption Polish (clean filler words from display)
4. Filler Word Audio Muting (silence them in audio)
5. Audio Clean (noise reduction)
6. Audio Normalize (set -16 LUFS)
7. Add animations

**For YouTube long-form:**
1. Dead air removal
2. Add captions
3. Chapter cuts (uses captions automatically — fast)
4. Batch animations (5–8 across the video)
5. Platform export (YouTube preset)

**For TikTok/Shorts:**
1. Trim to under 60s (FFmpeg: "trim to first 60 seconds")
2. Dead air removal
3. Add captions (large font, Bebas Neue, bottom position, Pop animation)
4. GIF overlays
5. Platform export (TikTok preset)

### Captions look better with:
- **Bebas Neue** font, **Black** weight, **Pop** animation — high energy
- **Poppins** font, **Bold** weight, **Karaoke** animation — professional and readable
- **White text, black stroke (3px)** — readable on any background
- **Bottom position** — most viewers expect captions at the bottom

### Save prompts you use repeatedly
After running any command, hover over your message and click ★ to save it. Your saved prompts appear in Quick Actions for one-click reuse.

---

## 14. Troubleshooting

### "Session not found" errors
The FFmpeg server has restarted since your last session. Refresh the browser page — a new session will be created when you upload your next asset. If the session was previously saved, it may auto-restore.

### Captions are out of sync
Select the T1 clip and use the **Time Offset** slider in the Caption Properties panel. Drag toward "Later" if captions appear too early (common), "Earlier" if too late.

### Dead air removal changed the video length unexpectedly
This is normal — silence was cut. If too much was removed, the threshold may have been too aggressive. You can't change the threshold in the UI; use the FFmpeg edit workflow to apply a manual silence removal with different settings: *"Remove silence quieter than -35dB and longer than 1 second"*.

### Animations aren't showing in the rendered video
Make sure the animation clips on V2 have correct start times that overlap with the V1 video. If an animation's Y position is very negative (visible in Clip Properties), it may be off-screen — reset transforms.

### FFmpeg server won't start
The PATH export in the server start command includes the FFmpeg binary location. If FFmpeg was installed somewhere different, update the path. Run `where ffmpeg` in a Windows terminal to find the correct path.

### Whisper transcription produces garbled text
This is a known issue with some audio. The server automatically uses Gemini instead of local Whisper for videos under ~2 minutes (where Gemini is more reliable). For longer videos, local Whisper is used. If you see Welsh/garbled output, the `language="en"` flag is set — it should self-correct on retry.

### Platform export makes the video look stretched
This happens if your video aspect ratio doesn't match the target platform. The preset uses `scale+pad` which adds black bars rather than cropping — the content is never stretched. If you want a crop instead, use the FFmpeg edit: *"Crop and scale to 1080x1920 for TikTok, centre the frame"*.

### "No video asset found" errors
The Director needs a video on the V1 track for most workflows. Upload a video and drag it to V1 before running AI commands.
