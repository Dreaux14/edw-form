// Builds handoff/Alumni Form - PASTE INTO WEBSITE.txt: one block for a single
// Elementor HTML widget, placed next to the existing Bloomerang Shortcode
// widget. It holds the styles and the form tweaks only; the form itself keeps
// loading from Bloomerang's hosted script. Re-run after changing either file:
//
//   node build-handoff.js
const fs = require("fs");
const path = require("path");

const read = (f) => fs.readFileSync(path.join(__dirname, f), "utf8").replace(/\r\n/g, "\n").trim();
const css = read("edw-alumni-form.css");
const tweaks = read("edw-form-enhancements.js");

// Anything that would end a <style>/<script> block early would break the paste.
if (css.toLowerCase().includes("</style")) throw new Error("css contains </style");
if (tweaks.toLowerCase().includes("</script")) throw new Error("tweaks contain </script");

const today = new Date().toISOString().slice(0, 10);
const out = `<!-- =====================================================================
     E. D. White Alumni Directory Form - styles and tweaks
     Paste this ENTIRE file into ONE Elementor "HTML" widget, placed right
     below the existing Bloomerang Shortcode widget (leave that one as is).
     Part 1: styles   Part 2: form tweaks
     Built ${today} from edw-alumni-form.css and edw-form-enhancements.js.
     ===================================================================== -->

<!-- Part 1: styles -->
<style>
${css}
</style>

<!-- Part 2: form tweaks (Maiden Name placement, "Any news?" topic buttons) -->
<script type="text/javascript">
${tweaks}
</script>
`;

const dir = path.join(__dirname, "handoff");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, "Alumni Form - PASTE INTO WEBSITE.txt");
fs.writeFileSync(file, out.replace(/\n/g, "\r\n"));
console.log("Wrote " + file + " (" + Math.round(out.length / 1024) + " KB, " + out.split("\n").length + " lines)");
