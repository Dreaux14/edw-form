# E. D. White Alumni Directory Form: restyle

A drop-in stylesheet for the Bloomerang form on
<https://edwhite.org/alumni-directory-form/>, plus a preview page that shows it in place.

| File | What it is |
| --- | --- |
| `edw-alumni-form.css` | **Deliverable 1.** Styles for the Bloomerang form. |
| `edw-form-enhancements.js` | **Deliverable 2.** Moves Maiden Name up beside the name fields and adds topic buttons and guiding questions to the "Any news?" field. |
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

The live page already loads the form through the Bloomerang script in an Elementor
**Shortcode** widget. Leave that widget as it is and add the styles in **one** of these places:

- **Elementor (recommended):** edit the page, select the section that contains the form, open
  **Advanced → Custom CSS**, and paste the full contents of `edw-alumni-form.css`.
  (This needs Elementor Pro, which the site already has.)
- **Site-wide:** go to **Appearance → Customize → Additional CSS** and paste it there.
  Every rule is scoped to `#interaction-form-container`, so nothing else on the site changes.

Colors and fonts come from the site's Elementor global settings (`--e-global-color-primary`,
Raleway, Lato). If the school's brand colors change in Elementor, the form updates with them.

**Form tweaks:** in the same Shortcode widget, after the Bloomerang `<script>` tag, add
`<script>` … `</script>` with the full contents of `edw-form-enhancements.js` pasted in
between. The script waits for Bloomerang to draw the form, then makes two changes:

- **Maiden Name** moves up into Contact Information, on the same row as First and Last Name.
- **"Any news?"** becomes topic buttons (Graduated, New job, Got married, New baby,
  Achievement, Other), one guiding question for each picked topic, and a larger text box
  with a character counter. Bloomerang still receives a single text value in the same
  custom field, with the chosen topics added at the front, for example
  `[New job, New baby] Started as an RN at…`. The field holds at most 255 characters,
  including those topic tags. To change the buttons or questions, edit the `TOPICS` list at
  the top of the file.

Nothing needs to change in Bloomerang. Bloomerang only collects custom fields from the
"Additional Information" section, so the script leaves a hidden copy of each original field
there and keeps it in sync with the visible one.

Optional: in the Shortcode widget, add `<div class="edw-form-loading">Loading form…</div>`
directly after the Bloomerang `<script>` tag. It fills the second or two before Bloomerang
draws the form and hides itself when the form appears.

### Notes
- The CSS depends on Bloomerang's class names (`.interaction-form`, `.section`, `.field`,
  `.checkbox.selected`). The custom-field layout rows depend on the field IDs
  (`CustomAccountField_146433`, `_16384`, `_16386`, `_4282369`). If fields are added to the form in
  Bloomerang, new fields default to full width, so nothing breaks; they just won't be
  placed side by side.
- On the live page, the email link under "Alumni Director" currently points to
  `/directory/michelle-keife/` instead of `mailto:mboudreaux@htdiocese.org`.
