# How to Install HyperEdit

A step-by-step guide to get HyperEdit running on a fresh computer. No technical knowledge needed.

---

## What You'll Need Before Starting

**A Windows, Mac, or Linux computer with:**
- At least 8GB RAM (16GB recommended)
- At least 10GB free disk space
- A web browser (Chrome recommended)
- An internet connection

**Free accounts to create (takes 5 minutes total):**
- Google AI Studio account (for the AI features) - https://aistudio.google.com
- Fal.ai account (for image generation) - https://fal.ai
- GIPHY developer account (for GIF search) - https://developers.giphy.com

---

## Step 1: Install Node.js

Node.js runs the app.

1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button)
3. Run the installer, click Next through everything
4. When done, open a command prompt and type: `node --version`
5. You should see a version number like `v20.x.x`

---

## Step 2: Install FFmpeg

FFmpeg processes all the video.

**Windows:**
1. Open a command prompt
2. Type: `winget install Gyan.FFmpeg`
3. Wait for it to finish
4. Close and reopen the command prompt
5. Type: `ffmpeg -version` to check it works

**Mac:**
1. Open Terminal
2. Type: `brew install ffmpeg`

---

## Step 3: Install Python

Python powers the speech-to-text transcription.

1. Go to https://python.org
2. Download Python 3.12 or newer
3. Run the installer - **tick "Add to PATH"** at the bottom
4. Open a command prompt and type: `python --version`

Then install Whisper:
```
pip install openai-whisper
```

---

## Step 4: Download HyperEdit

1. Download or clone the HyperEdit folder to your computer
2. Open a command prompt
3. Navigate to the folder: `cd path/to/hyperedit`
4. Install dependencies: `npm install`
5. Wait for it to finish (may take 2-3 minutes)

---

## Step 5: Set Up Your API Keys

1. In the HyperEdit folder, create a new file called `.dev.vars`
2. Open it in Notepad and paste this, replacing with your actual keys:

```
GEMINI_API_KEY=paste_your_gemini_key_here
FAL_API_KEY=paste_your_fal_key_here
GIPHY_API_KEY=paste_your_giphy_key_here
OPENAI_API_KEY=paste_your_openai_key_here
```

**Where to get each key:**
- **Gemini:** Go to https://aistudio.google.com/apikey, click "Create API Key"
- **Fal.ai:** Go to https://fal.ai, sign up, go to Settings > API Keys
- **GIPHY:** Go to https://developers.giphy.com, create an app, copy the API key
- **OpenAI:** Go to https://platform.openai.com/api-keys (optional, costs money)

3. Save the file

---

## Step 6: Start HyperEdit

You need TWO command prompt windows open at the same time.

**Window 1 - Start the video server:**
```
cd path/to/hyperedit
node scripts/local-ffmpeg-server.js
```
You should see: `Local FFmpeg server running at http://localhost:3333`

**Window 2 - Start the app:**
```
cd path/to/hyperedit
npm run dev
```
You should see: `Local: http://localhost:5173`

**Open your browser and go to: http://localhost:5173**

You should see the HyperEdit editor. You're ready to go.

---

## Step 7 (Optional): Install Extra Tools

These add more features but aren't required to use HyperEdit.

**NCA Toolkit** (better video captioning, format conversion, picture-in-picture):
1. Install Docker from https://docker.com
2. Download the NCA Toolkit folder
3. In a command prompt: `cd no-code-architects-toolkit`
4. Run: `docker compose -f docker-compose.standalone.yml up -d`
5. Check it works: open http://localhost:8080 in your browser

**Remotion Video Templates** (8 automated video templates you can import):
1. Make sure Docker is installed
2. In a command prompt: `cd remotion-automation`
3. Run: `docker compose up -d`
4. Check it works: open http://localhost:3100/health in your browser

---

## Stopping HyperEdit

- Press `Ctrl+C` in both command prompt windows
- Your work is saved automatically

## Starting Again Next Time

Just repeat Step 6 - open two command prompts and run the two commands.

---

## Something Not Working?

| Problem | Fix |
|---------|-----|
| "FFmpeg not found" | Reinstall FFmpeg (Step 2), then close and reopen the command prompt |
| "Cannot find module" | Run `npm install` again in the HyperEdit folder |
| "Session not found" in the browser | Restart the video server (Window 1) |
| Blank screen in browser | Make sure both servers are running (Window 1 and 2) |
| Slow video processing | Normal for large videos. Wait for it to finish. |
| "API key" errors | Check your .dev.vars file has the correct keys (Step 5) |
