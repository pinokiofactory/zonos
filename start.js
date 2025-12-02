const fg = require('fast-glob');
const path = require('path')
module.exports = async (kernel) => {
  let env = {
    ZONOS_HOST: "127.0.0.1",
    TORCHINDUCTOR_CACHE_DIR: kernel.path("cache/TORCH_INDUCTOR")
//    PYTHONUTF8: 1
  }
  if (kernel.platform === 'darwin') {
    try {
      let p
      let bin = kernel.path("bin/homebrew/Cellar")
      const matches = await fg(`${bin}/**/espeak-ng-data`, { onlyDirectories: true });
      if (matches.length > 0) {
        p = matches[0]
      }
      env.ESPEAK_DATA_PATH = p
    } catch (err) {
      console.error(`Error searching: ${err.message}`);
    }

    try {
      let p
      let bin = kernel.path("bin/homebrew/Cellar")
      const matches = await fg(`${bin}/**/libespeak-ng.dylib`)
      if (matches.length > 0) {
        p = matches[0]
      }
      env.PHONEMIZER_ESPEAK_LIBRARY = p
    } catch (err) {
      console.error(`Error searching: ${err.message}`);
    }
  } else if (kernel.platform === "win32") {
    let espeakPath = kernel.template.vals.which("espeak-ng")
    let espeakRoot = path.dirname(espeakPath)
    env.PHONEMIZER_ESPEAK_PATH = espeakRoot
    env.PHONEMIZER_ESPEAK_LIBRARY = path.resolve(espeakRoot, "libespeak-ng.dll")
    env.ESPEAK_DATA_PATH = path.resolve(espeakRoot, "espeak-ng-data")
    let LIBPATH = kernel.bin.path("miniconda/libs")
    env.LINK = `/LIBPATH:${LIBPATH}`
//    env.CXX = "cl.exe"
//    env.CC = "cl.exe"
  }
  console.log("ENV", env)

  return {
    requires: {
      bundle: "ai",
    },
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          build: true,
          venv: "env",
          env,
          path: "app",
          message: [
            "python gradio_interface.py",
          ],
          on: [{
            "event": "/http:\/\/\\S+/",
            "done": true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[0]}}"
        }
      }
    ]
  }
}
