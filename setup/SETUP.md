# Trademark Safety App — Setup Guide

Setup takes about **10 minutes**. No Azure, no Power Apps, no special accounts needed.

---

## What You Need

- Windows PC with internet connection
- Node.js installed (download free at https://nodejs.org — click "LTS")
- Your Microsoft 365 email: `renan.j@trademarkmasonry.ca`

---

## Step 1 — Install Node.js

1. Go to **https://nodejs.org**
2. Click the big **"LTS"** button to download
3. Run the installer — click Next → Next → Install
4. Restart your computer after installing

---

## Step 2 — Configure Your Email

1. Go to the `backend` folder
2. Find `.env.example` — copy it and rename the copy to `.env`
3. Open `.env` with Notepad and fill it in:

```
EMAIL_SERVICE=outlook
EMAIL_USER=renan.j@trademarkmasonry.ca
EMAIL_PASS=YourPasswordHere
EMAIL_TO=renan.j@trademarkmasonry.ca
PORT=3001
CORS_ORIGINS=*
```

- **EMAIL_USER** = your Microsoft 365 email address
- **EMAIL_PASS** = your email password
- **EMAIL_TO** = where submissions get emailed (can be same address, or a shared inbox)

4. Save the file

> **If login fails (MFA/2FA is enabled on your account):**
> You need an App Password. See the section below.

---

## Step 3 — Start the Server

1. Go to the `backend` folder
2. **Double-click `start.bat`**
3. A black window opens — wait for it to say:
   ```
   ✓ Email connection OK — ready to receive submissions!
   ```
4. Keep this window open while workers are using the app

---

## Step 4 — Open the App

- **From your PC:** Open `index.html` directly in Chrome or Edge
- **From workers' phones:** See "Sharing with Workers" below

---

## Sharing the App with Workers

Workers need to be able to reach two things:
1. The **app page** (the form they fill in)
2. The **backend server** (running on your PC)

### Easiest Option — Same WiFi Network (office or site trailer)

1. Find your PC's local IP address:
   - Press Windows + R → type `cmd` → Enter
   - Type: `ipconfig` → press Enter
   - Look for `IPv4 Address` (e.g., `192.168.1.105`)

2. Workers open the app in their phone browser at:
   `http://192.168.1.105:3001` — but this requires them to be on the same WiFi

3. You also need to update the backend URL in `js/api.js`:
   - Open `js/api.js` in Notepad
   - Change `http://localhost:3001` to `http://192.168.1.105:3001`

### Better Option — Internet Access Anywhere (ngrok)

1. Download ngrok: https://ngrok.com/download — create a free account
2. Run: `ngrok http 3001`
3. Copy the URL shown (like `https://abc123.ngrok-free.app`)
4. In `js/api.js`, change the backend URL to that ngrok URL
5. Open `index.html` — workers can access the app from any device, anywhere

### Best Option — Host on GitHub Pages + Render

For a permanent URL that always works, see the instructions at the bottom.

---

## What Happens When a Worker Submits

1. Worker fills the form on their phone and hits Submit
2. App generates a PDF report automatically
3. PDF + all photos are emailed to `EMAIL_TO`
4. You receive an email like:

   **Subject:** `[Safety] Daily Tailgate — 25TM010 - Caliber - Firehall — 2026-05-05`

   The email has:
   - A formatted summary of all form fields
   - The PDF report attached
   - All photos attached

5. You can save the attachments to OneDrive manually, or set up an Outlook rule to do it automatically

---

## Setting Up an Outlook Rule (Auto-Save Attachments)

To automatically move safety emails to a folder in Outlook:

1. In Outlook, right-click one of the safety emails
2. Click **Rules → Create Rule**
3. Check "Subject contains" and type `[Safety]`
4. Check "Move the item to folder" → choose or create a `Safety Forms` folder
5. Click OK

For auto-saving to OneDrive, use **Power Automate** if you get access later, or save manually from Outlook.

---

## Troubleshooting

**"Cannot find module"**
→ Open Command Prompt in the `backend` folder and run: `npm install`

**"Invalid login" or "535 Authentication failed"**
→ Your password is wrong, or you need an App Password (see below)

**"Connection refused" when workers try to submit**
→ Make sure `start.bat` is still running and hasn't been closed

**Workers can't open the app**
→ They need either the same WiFi network or you need to use ngrok

---

## App Password (if your account has MFA/2FA)

If Microsoft 365 has multi-factor authentication enabled:

1. Sign in at **https://myaccount.microsoft.com**
2. Click **Security info** in the left menu
3. Click **+ Add method** → choose **App password**
4. Name it `Safety App` → click Next
5. Copy the password shown
6. Paste it into `.env` as `EMAIL_PASS=`

---

## Adding New Projects

Open `js/form-configs.js` in Notepad and add the project name to the `PROJECTS` array at the top. Save the file — done.

---

## Daily Operation

1. Double-click `backend/start.bat` — keep the window open
2. Workers open the app link and submit forms
3. You receive emails with PDF + photos
4. At end of day, close the server window

That's it — no Azure, no complicated setup!
