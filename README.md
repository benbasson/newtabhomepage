New Tab Homepage
================
Loads your homepage when you open a new tab, and ensures its content is focused.

Installation
------------
Drag and drop the latest XPI file from the build folder into a Firefox window. Alternatively, you can install the extension from https://addons.mozilla.org/en-US/firefox/addon/new-tab-homepage/

### Temporary (development, any Firefox)

1. Open `about:debugging` → **This Firefox** → **Load Temporary Add-on…**
2. Select `src/manifest.json`.

The add-on is removed when Firefox restarts. For live reload during
development:

```sh
web-ext run --source-dir src
```

### Permanent (unsigned)

Firefox builds with `MOZ_REQUIRE_SIGNING` off allow you to install unsigned
extensions:

1. `about:config` → set `xpinstall.signatures.required` to `false`.
2. `about:addons` → gear icon → **Install Add-on From File…** → then select
   `.xpi`

Build it with:

```bash
cd src/
zip -r -FS "../new-tab-homepage.xpi" \
    manifest.json \
    background.js \
    redirect.html redirect.js \
    -x '*.DS_Store'
cd ..
```

### Permanent (signed, unlisted)

```sh
web-ext sign --source-dir src --channel=unlisted \
    --api-key=$JWT_ISSUER --api-secret=$JWT_SECRET
```

Get your API key/secret from <https://addons.mozilla.org/developers/addon/api/key/>.

Check
-----

```sh
web-ext lint --source-dir src
```

Authors
-------
 - Ben Basson *@ben_basson*
