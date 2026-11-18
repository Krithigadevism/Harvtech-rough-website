# HARVTECH PRIVATE LIMITED - Futuristic 3D Website

Official web application built for **Harvtech Private Limited**, inspired by the cinematic website experience and scroll animations of **flomobility.com**, tailored specifically for Harvtech's clean electric farm machinery identity.

---

## 🏢 Official Company Information
- **Company Name:** `Harvtech Private Limited` (Emblem spelling: `H A R V T E C H`)
- **Theme Palette:** High-contrast **Mustard Yellow** (`#e5a910`) and **Deep Black** (`#08090a` / `#16171c`), with Ember Red accents from the logo.
- **Registered Office:**
  ```
  HARVTECH PRIVATE LIMITED
  PLOT 78/79, FLAT 2, PAVITHRA APARTMENTS,
  Madambakkam, Tambaram,
  Kanchipuram - 600126, Tamil Nadu, India.
  ```
- **Official Email:** `harvtechllp@gmail.com`
- **Instagram:** `@its_harvtech` (https://www.instagram.com/its_harvtech)
- **LinkedIn:** `HARVTECH`

---

## 🚀 Website Structure & Highlights

### 1. Navigation Bar
- **Left Side:** HARVTECH Company Logo (`H A R V T E C H`) and subline `Private Limited` (the words "agri machinery" have been removed as instructed).
- **Right Side Navigation Menu:**
  - `Home`
  - `Products`
  - `Gallery`
  - `Contact Us`
- **HUD Audio Interface:** Interactive UI sound synthesised via Web Audio API.
- **Mobile Responsive Drawer:** Collapsible navigation menu for mobile devices.

---

### 2. Homepage – Cinematic Scroll-Controlled Video Animation
- **AI-Generated Commercial Story Video (`assets/videos/homepage-story.mp4`):**
  - Full-screen pinned scroll timeline with hardware acceleration.
  - As the user scrolls down, `video.currentTime` scrubs frame-by-frame smoothly through the complete sequence:
    1. **Scene 1 (0.0s – 3.8s):** Dawn in the Indian Village & Woman farmer standing by the HARVTECH Electric Power Weeder.
    2. **Scene 2 (3.8s – 7.6s):** Battery Collection at the solar dock, carrying with both hands.
    3. **Scene 3 (7.6s – 12.0s):** Front-Facing Battery Installation & Lock (HARVTECH logo clearly visible on front).
    4. **Scene 4 (12.0s – 15.8s):** Instant start & active soil tilling / weeding in the field furrow.
    5. **Scene 5 (15.8s – 18.84s):** Panoramic aerial sunrise view with final brand reveal and CTA buttons.
  - **Reversing scroll rewinds the video smoothly frame-by-frame.**
  - **Live Timecode Badge:** Displays live video playback timestamp (`00:08 / 00:18`).
  - **Audio Toggle (`UNMUTE / MUTED`):** Allows unmuting the video's original soundtrack.
  - **Auto-Play Commercial Mode:** Click **"PLAY STORY"** to watch the video play automatically like a commercial, in sync with page scrolling.
  - **Timeline Scrubber:** Click or drag anywhere on the timeline bar to jump directly to any second of the video.
  - **Chapter Jump Dots:** Jump instantly to Scenes 01, 02, 03, 04, or 05.

---

### 3. Products Section (Strict Order Specification)

#### Product 1: Power Weeder (Maximum Visual Importance - AVAILABLE NOW)
- Large, realistic multi-angle 3D turntable viewer with 360° automatic rotation.
- Processed in **mustard yellow and sleek black** as requested.
- Angle presets for direct inspection:
  - **Front Angle**
  - **Side Profile**
  - **Rear / Motor Assembly**
  - **3/4 Isometric Perspective**
- Interactive drag-to-spin and touch support.
- Detailed specifications (BLDC High-Torque Motor, Swappable Lithium-Ion Battery, 1.5–3.0 ft Adjustable Width, 4–6 Hours Runtime).
- **Book Demonstration Button:** Prominently highlighted in mustard yellow; redirects directly to the **Contact Us** page and pre-selects the Power Weeder in the form.

#### Product 2: Tiller (COMING SOON)
- Premium card design with glowing **"Coming Soon"** badge.
- Visually secondary to the Power Weeder.
- Teaser specs: Boron steel helical blades, dual swappable battery enclosure, forward/reverse drive gears.
- Clearly marked as not available for purchase or demo booking.

#### Product 3: Mini Tractor (COMING SOON)
- Premium card design with glowing **"Coming Soon"** badge.
- Visually secondary to the Power Weeder.
- Teaser specs: 15HP equivalent torque, Cat-1 3-point hitch, autonomous row-following sensor ready.
- Clearly marked as not available for purchase or demo booking.

---

### 4. Gallery Section
- Dedicated showcase of real-world activities:
  - **Machinery Demonstrations** (Field trials in Chengalpattu Farmlands)
  - **Events & Expos** (National Agri-Tech Summit at Coimbatore)
  - **Farmer Interactions** (Usability workshop in Kanchipuram)
  - **R&D & Prototyping** (Dyno testing & chassis assembly in Chennai lab)
- Category filter tabs (`All Experiences`, `Machinery Demos`, `Events & Expos`, `Farmer Interactions`, `R&D & Prototyping`).
- Interactive lightbox modal for full-screen inspection.

---

### 5. Contact Us Section (Two Distinct Areas)

#### Left Side – Company Contact & Social Media
- Company introduction & mission.
- Verified channels:
  - LinkedIn: `HARVTECH`
  - Instagram: `its_harvtech`
  - Email: `harvtechllp@gmail.com` (with one-click copy button and mailto link)
- **Exact Registered Office Address:**
  ```
  HARVTECH PRIVATE LIMITED
  PLOT 78/79, FLAT 2, PAVITHRA APARTMENTS,
  Madambakkam, Tambaram,
  Kanchipuram - 600126, Tamil Nadu, India.
  ```

#### Right Side – Book a Demonstration Form
- Form fields:
  1. **Full Name**
  2. **Contact Number**
  3. **Email Address**
  4. **Farm / Village Location**
  5. **Product Interested In (Dropdown):**
     - *Power Weeder (Currently Available)*
     - *Tiller (Coming Soon - Waitlist)*
     - *Mini Tractor (Coming Soon - Waitlist)*
  6. **Additional Message (optional)**
- **Send Request Button:**
  - Input validation (validates phone number length, email format, and required fields).
  - Animated submission spinner.
  - Persistent storage in `localStorage` (`harvtech_demo_requests`).
  - Toast confirmation with generated registration ID.

---

## 📁 File Structure

```
harvtech-website/
├── index.html                     # Main semantic SPA website with Three.js 3D canvas
├── README.md                      # Documentation & user guide
├── css/
│   └── style.css                  # Mustard & Black theme styling, HUD telemetry, responsive layout
├── js/
│   └── app.js                     # Three.js 3D farmland & scroll camera, 360 viewer, form handler
└── assets/
    ├── images/
    │   ├── harvtech-logo.jpg      # Official Harvtech logo
    │   ├── power-weeder-clean.png # Power weeder in yellow & black (3/4 perspective)
    │   ├── angle-front.png        # Power weeder front view (yellow & black)
    │   ├── angle-side.png         # Power weeder side profile (yellow & black)
    │   ├── angle-rear.png         # Power weeder rear motor view (yellow & black)
    │   ├── electric-tiller.jpg    # Electric tiller preview asset
    │   ├── mini-tractor.jpg       # Mini tractor preview asset
    │   └── gallery-*.jpg          # Field trials, demos, expos & farmer meets
    └── videos/
        └── (Optional custom video files)
```

---

## 💻 How to View & Run
Open `index.html` in any modern web browser or run:
```powershell
cd "c:\Users\Krithiga Devi\Desktop\harvtech-website"
python -m http.server 8080
```
Then visit `http://localhost:8080`.
