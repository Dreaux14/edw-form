# E. D. White Alumni Directory Form: restyle

A restyle and small usability tweaks for the Bloomerang form on
<https://edwhite.org/alumni-directory-form/>, plus a preview page that shows it in place.

| File | What it is |
| --- | --- |
| `handoff/` | **What goes to the website manager:** step-by-step instructions plus one block to paste into the page. Built by `build-handoff.js`. |
| `edw-alumni-form.css` | Styles for the Bloomerang form. |
| `edw-form-enhancements.js` | Moves Maiden Name up beside the name fields and adds topic buttons and guiding questions to the "Any news?" field. |
| `build-handoff.js` | Combines the CSS and the tweaks into the paste file in `handoff/`. |
| `index.html` | Preview page that approximates the edwhite.org layout and loads the real form. |
| `bloomerang-form.js` | The form code from `form.html`, moved into its own file and otherwise unchanged. |
| `form.html` | The original embed code from Bloomerang, kept for reference. |
| `package.json` | Lets Railway serve the folder. GitHub Pages ignores it. |

## Previewing

- **Test mode (default):** filling out the form and pressing Submit runs validation and then
  shows the "Once a Cardinal…" thank-you screen. **Nothing is sent to Bloomerang.**
- **Live mode:** turn on the **Test mode / Live submissions** switch in the bottom-right
  corner and confirm the prompt. The switch and the top banner turn red, and submissions go
  to the diocese's real Bloomerang database. The setting is saved in the URL as `?live=1`,
  so it survives a refresh, and that link opens straight into live mode. Switch it off to go
  back to test mode.

Run it locally with `npx serve .` and open http://localhost:3000. Opening `index.html`
straight from disk also works. Locally, only test mode is available: Bloomerang's script
sends requests to its own developer server whenever the address contains `localhost` or
starts with `file://`, so the switch is disabled there. Live mode works on the hosted
GitHub Pages or Railway address.

### GitHub Pages
1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages → Build and deployment**, choose *Deploy from a branch*, then
   select `main` and `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

### Railway
1. Create a new project from the GitHub repo (or run `railway up` in this folder).
2. Railway sees `package.json` and runs `npm start`, which serves the folder on `$PORT`.
3. Under **Settings → Networking**, click *Generate Domain*.

## Putting it on edwhite.org

The live page loads the form through Bloomerang's hosted script in an Elementor
**Shortcode** widget. That stays as it is. The website manager adds one Elementor **HTML**
widget below it, containing the styles and the tweaks:

1. `node build-handoff.js` builds `handoff/Alumni Form - PASTE INTO WEBSITE.txt` from
   `edw-alumni-form.css` and `edw-form-enhancements.js`. Re-run it after changing either.
2. Send the website manager the two files in `handoff/`. The instructions file covers
   adding the widget, clearing caches and testing.

Because the hosted script stays in place, form changes made in Bloomerang still appear on
the site automatically, and Bloomerang's anti-spam form-load check keeps working.
To undo, delete the HTML widget.

Notes on the pieces:

- **Styles:** every rule is scoped to `#interaction-form-container`. Colors and fonts come
  from the site's Elementor global settings (`--e-global-color-primary`, Raleway, Lato),
  so if the brand colors change in Elementor, the form follows.
- **Tweaks** (`edw-form-enhancements.js`): **Maiden Name** moves up beside First and Last
  Name. **Military service** moves up beside Birthdate and Graduation Year, lists "Not
  Active Duty or Veteran" last, and allows only one pick, since the answers are mutually
  exclusive. In Bloomerang it's a multi-select, so it's still saved as one picked value.
  **"Any news?"** becomes topic buttons (Graduated, New job, Got married, New baby,
  Achievement, Other) with one guiding question per picked topic and a text box with a
  character counter. Bloomerang still receives one text value in the same field, with the
  topics added at the front: `[New job, New baby] Started as an RN at…`. The limit is 255
  characters, tags included. To change the buttons or questions, edit `TOPICS`. The script
  waits for Bloomerang to insert the form, so it can sit in its own widget.
- Bloomerang only collects custom fields from the "Additional Information" section, so
  the Maiden Name and news tweaks leave the original field there as a hidden input and keep
  it in sync with the visible one. The military field only moves within that section.
- The hosted widget names custom fields `Account_<n>`, and the pasted embed in `form.html`
  (used by the demo) names them `CustomAccountField_<n>`. The CSS and the tweaks handle both.
- Headless Chrome testing quirk: from this machine, automated browsers were served a copy of
  the hosted widget code that declares `var html4215808` twice and never renders the form,
  while a normal browser renders it fine. If the live form ever stops appearing, swapping
  the Shortcode widget for the embed code in `form.html` (without its `<pre>` wrapper) is
  the fallback. Do a live test submission first, because the embed never sets
  Bloomerang's form-load ID.

### Notes
- The CSS depends on Bloomerang's class names (`.interaction-form`, `.section`, `.field`,
  `.checkbox.selected`). The custom-field layout rows depend on the field IDs
  (Birthdate `6136833`, Graduation Year `16384`, Maiden Name `16386`, military `6132737`,
  news `4282369`). If fields are added to the form in
  Bloomerang, new fields default to full width, so nothing breaks; they just won't be
  placed side by side.
- On the live page, the email link under "Alumni Director" currently points to
  `/directory/michelle-keife/` instead of `mailto:mboudreaux@htdiocese.org`.
