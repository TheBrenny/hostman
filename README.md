![Hero Banner](./docs/hostman-banner-social.png)

# hostman

Hostman is an easy to use web app that allows you to manage your hosts file without the hassle of finding it, opening it, changing, saving and continuing on with life. Instead, you navigate to `http://hostman/` (or just `hostman/`) and add in your hostname and IP address!

![Hero Screenshot](./docs/hero-screenshot.png)

## Motivation

The motivation for this project is quite simple, and likely one that you can sympathise with: I just want to use hostnames instead of IP addresses when I'm spinning local dev servers.

The one extra thing that hostman can do though, is bind a hostname to a fully resolvable URL! So if you want to, you can point `http://yt` to `https://youtube.com`, or `http://git/` to `https://github.com`! Most browsers even accept `url/` as a valid URL!

## Installation

```console
$ npm install -g @thebrenny/hostman
$ hostman install
$ hostman service install
```

Hostman has an additional install script ([`./install/install.js`](./install/install.js)) to bind itself to `127.3.3.3`, but to do this it needs to have [sudo/Admin](#sudo) privileges, which will be asked during the install process. If the administative request fails, the script will exit unsuccessfully (exit code provided by `sudo`, or `1`).

If you don't install the service, you can execute `hostman` to quickly spin up the server.

### Uninstallation

Hostman is also convenient to uninstall - running `hostman service uninstall` will uninstall the hostman service, however it will leave your hosts file in tact - therefore you can still run `hostman run` to spin up the hostman server.

Running `hostman uninstall` will wipe all hostman-created hosts. This is handy to mass clear your hosts, however it's pretty detructive, and it might be easier to finesses the file by hand instead.

### Notes

- **The server needs to be up for non-IP bindings to be reachable!** If the server is down, bindings such as `yt -> youtube.com` will not work, but `yt -> 127.4.2.5` will.
- **Uninstalling via npm without uninstalling the service can make your system whinge!** Make sure you delete the service first. Trust me. Maybe it's just Windows, but I had a lot of issues trying to delete the service without having hostman installed.

## Sudo

All sudo/Admin requests are handled through `sudo-prompt` and all actions that modify the actualy hosts file are handled through `hosts-etc` (also checkout `hosts-etc-cli`!).

## Contributing

Clone the repo, and run `npm install` (or `pnpm install` or `yarn`).

Start a development server:

```bash
npm run dev

# or start the server and open hostman in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License (see [`license.md`](./license.md))

| Project | License | Link                                     |
| :-----: | :-----: | :--------------------------------------- |
| Hostman |   MIT   | https://choosealicense.com/licenses/mit/ |
|  WinSW  |   MIT   | https://choosealicense.com/licenses/mit/ |
