# Fast Chromium Development Guide for Slave Browser

This repository is optimized for extremely fast C++ iteration on a standard local machine without needing a massive distributed cluster. 

## 1. Local Development (`SlaveDev`)

Your default development environment uses component builds, minimal symbols, and no PGO/LTO to guarantee the fastest compile times possible when making changes.

### Available Scripts

We have added helper scripts in `tools/slave/` to make Chromium builds easy:

* **`tools/slave/status.sh`**
  Prints your system specs, RAM, free disk space, and current GN arguments.

* **`tools/slave/build-dev.sh`**
  Builds the entire `chrome` target using `autoninja` in your `out/SlaveDev` directory. Use this when you've modified many files.

* **`tools/slave/build-file.sh <path/to/file.cc>`**
  Builds *only* the specific target that contains your modified source file. Extremely useful for fast iteration!
  **Example:** `./tools/slave/build-file.sh chrome/browser/ui/views/side_panel/side_panel.cc`

* **`tools/slave/clean-dev.sh`**
  Safely cleans the `out/SlaveDev` build cache without touching your source code.

### Recreating the `SlaveDev` Build Profile
If you ever lose `out/SlaveDev` or need to regenerate the Ninja files, run:
```bash
export PATH="/code/BrowserX/depot_tools:$PATH"
cd /code/BrowserX/chromium/src
gn gen out/SlaveDev --args="is_debug=false dcheck_always_on=true is_component_build=true symbol_level=1 blink_symbol_level=0 v8_symbol_level=0 use_siso=false"
```
*(Siso is disabled locally by default because it requires `.sisoenv` populated by a full `gclient sync`, which we skip for this detached checkout).*

## 2. Release & Remote Builds (`SlaveRelease`)

The release configuration is heavily optimized for distribution (Official Build, ThinLTO, no symbols). **Do not use this for local iteration** as it takes hours.

### Recreating the `SlaveRelease` Build Profile
```bash
gn gen out/SlaveRelease --args="is_debug=false is_official_build=true is_component_build=false symbol_level=0 use_thin_lto=true use_siso=false chrome_pgo_phase=0"
```

### GitHub Actions CI
We have configured two workflows in `.github/workflows/`:
1. **Slave Browser Build (`slave-build.yml`)**: Runs on PRs and pushes. It checks out the tree and performs a dummy/minimal validation setup.
2. **Slave Browser Release (`slave-release.yml`)**: Triggered manually via GitHub UI. It builds the full `SlaveRelease` target and uploads `Slave-Browser-linux-x64-<commit>.tar.xz` as an artifact.

> **Note on Free GitHub Runners**: Standard GitHub Actions runners for public repos only have ~14GB of free space. A full Chromium clone requires 40GB+. The remote build workflow includes aggressive disk cleanup steps, but might still fail on disk constraints unless you use a pre-built base image, sparse checkout, or large-disk runners.

## 3. Running Tests and the Browser

**Running the Browser:**
```bash
cd /code/BrowserX/chromium/src
./out/SlaveDev/chrome
```

**Running Tests:**
Chromium unit tests are built as separate targets. You can build and run them like this:
```bash
autoninja -C out/SlaveDev unit_tests
./out/SlaveDev/unit_tests --gtest_filter=SidePanel*
```

## 4. Troubleshooting
* **Out of Memory (OOM)**: Chromium linking uses massive amounts of RAM. Ensure you have 10GB+ free RAM/Swap. You can artificially limit parallelism by passing `-j 6` to `autoninja`.
* **Broken Ninja Cache**: Run `./tools/slave/clean-dev.sh` and re-run the build script.
* **Missing depot_tools**: Ensure `/code/BrowserX/depot_tools` is on your `$PATH`.
