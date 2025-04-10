module.exports = async (kernel) => {
  return {
    run: [
      // Edit this step to customize the git repository to use
      {
        method: "fs.rm",
        params: {
          path: kernel.path("cache/TORCH_INDUCTOR")
        }
      },
      {
        method: "shell.run",
        params: {
          message: [
            //"git clone -b torch-backbone https://github.com/cocktailpeanut/Zonos app",
            "git clone https://github.com/cocktailpeanut/Zonos app",
            "pnpm install",
            "pnpm run clear"
          ]
        }
      },
      {
        method: "script.start",
        params: {
          uri: "torch.js",
          params: {
            venv: "env",                // Edit this to customize the venv folder path
            path: "app",                // Edit this to customize the path to start the shell from
            // xformers: true   // uncomment this line if your project requires xformers
          }
        }
      },
      // Edit this step with your custom install commands
      {
        method: "shell.run",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: "app",                // Edit this to customize the path to start the shell from
          message: [
            "uv pip install -e .",
          ]
        }
      },
      {
        when: "{{platform === 'win32'}}",
        method: "shell.run",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: "app",                // Edit this to customize the path to start the shell from
          message: [
            "uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.1.0-windows.post8/triton-3.1.0-cp310-cp310-win_amd64.whl",
          ]
        }
      },
      {
        when: "{{platform === 'linux'}}",
        method: "shell.run",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: "app",                // Edit this to customize the path to start the shell from
          message: [
            "uv pip install -e .[compile]"
          ]
        }
      },
  //    {
  //      method: "fs.link",
  //      params: {
  //        venv: "app/env"
  //      }
  //    },

      // espeak-ng installer script lifted from AllTalk Launcher from 6Morpheus6
      // https://github.com/pinokiofactory/AllTalk-TTS/blob/main/install.js
      {
        when: "{{which('brew')}}",
        method: "shell.run",
        params: {
          message: "brew install espeak-ng"
        },
        next: 'end'
      },
      {
        when: "{{which('apt')}}",
        method: "shell.run",
        params: {
          sudo: true,
          message: "apt install libaio-dev espeak-ng"
        },
        next: 'end'
      },
      {
        when: "{{which('yum')}}",
        method: "shell.run",
        params: {
          sudo: true,
          message: "yum install libaio-devel espeak-ng"
        },
        next: 'end'
      },
      {
        when: "{{which('winget')}}",
        method: "shell.run",
        params: {
          sudo: true,
          message: "winget install --id=eSpeak-NG.eSpeak-NG -e --silent --accept-source-agreements --accept-package-agreements"
        }
      },
      {
        id: 'end',
        method: 'input',
        params: {
          title: "Restart Pinokio!!",
          description: "Install Complete. Please restart Pinokio and try running the app"
        }
      },
    ]
  }
}
