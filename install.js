module.exports = async (kernel) => {
  return {
    run: [
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
            venv: "env",
            path: "app",
            // xformers: true
          }
        }
      },
      {
        when: "{{platform === 'win32' && gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
        method: "jump",
        params: {
          id: "install"
        }
      },
      {
        when: "{{platform === 'win32'}}",
        method: "fs.copy",
        params: {
          src: "cpp_builder.py",
          dest: "app/env/lib/site-packages/torch/_inductor/cpp_builder.py"
        }
      },
      {
        when: "{{platform !== 'win32'}}",
        method: "fs.copy",
        params: {
          src: "cpp_builder.py",
          dest: "app/env/lib/python3.10/site-packages/torch/_inductor/cpp_builder.py"
        }
      },
      {
        id: "install",
        method: "shell.run",
        params: {
          venv: "env",
          path: "app",
          message: [
            "uv pip install -e .",
          ]
        }
      },
      {
        when: "{{platform === 'linux'}}",
        method: "shell.run",
        params: {
          venv: "env",
          path: "app",
          message: [
            "uv pip install wheel",
            "uv pip install -e .[compile]"
          ]
        }
      },
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
