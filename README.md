# E. D. White Alumni Directory Form: restyle

A drop-in stylesheet for the Bloomerang form on
<https://edwhite.org/alumni-directory-form/>, plus a preview page that shows it in place.

| File | What it is |
| --- | --- |
| `edw-alumni-form.css` | **The deliverable.** Styles for the Bloomerang form. This is the only file WordPress needs. |
| `index.html` | Preview page that approximates the edwhite.org layout and loads the real form. |
| `bloomerang-form.js` | The form code from `form.html`, moved into its own file and otherwise unchanged. |
| `form.html` | The original embed code from Bloomerang, kept for reference. |
| `package.json` | Lets Railway serve the folder. GitHub Pages ignores it. |

## Previewing

- **Test mode (default):** filling out the form and pressing Submit runs validation and then
  shows the "Once a Cardinal…" thank-you screen. **Nothing is sent to Bloomerang.**
- **Live mode:** add `?live=1` to the URL (for example `…/index.html?live=1`) to send real
  submissions to the diocese's Bloomerang database.

Run it locally with `npx serve .` and open http://localhost:3000. Opening `index.html`
straight from disk also works.

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

Optional: in the Shortcode widget, add `<div class="edw-form-loading">Loading form…</div>`
directly after the Bloomerang `<script>` tag. It fills the second or two before Bloomerang
draws the form and hides itself when the form appears.

### Notes
- The CSS depends on Bloomerang's class names (`.interaction-form`, `.section`, `.field`,
  `.checkbox.selected`). The custom-field layout rows depend on the field IDs
  (`CustomAccountField_146433`, `_16384`, `_16386`). If fields are added to the form in
  Bloomerang, new fields default to full width, so nothing breaks; they just won't be
  placed side by side.
- On the live page, the email link under "Alumni Director" currently points to
  `/directory/michelle-keife/` instead of `mailto:mboudreaux@htdiocese.org`.
