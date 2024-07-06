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
```

Hostman has a post-install script to install itself as a service and bind itself to `127.3.3.3`, but to do this it needs to have [access to sudo/Admin](#sudo) which will be asked during the install process. If the administative request fails, the post-install script will exit successfully in order to not disrupt the chain. To restart the administrative install again, run `hostman install`.

If you don't install the service, you can execute `hostman run` to quickly spin up the server.

Hostman also makes it convenient to uninstall - running `npm uninstall -g @thebrenny/hostman` will automatically uninstall hostman and the service, however it will leave your hosts file in tact (in case you want to reinstall hostman again). Otherwise, if you want to keep hostman installed, but remove the service, run `hostman uninstall`, and you can still run `hostman run` to spin up the hostman server.

**The server needs to be up for non-IP bindings to be reachable!** If the server is down, bindings such as `yt -> youtube.com` will not work, but `yt -> 127.4.2.5` will.

## Sudo

All sudo/Admin requests are handled through `sudo-prompt` and all actions that modify the actualy hosts file are handled through `hosts-etc` (also checkout `hosts-etc-cli`!).

## Contributing

Once you've cloned and installed the dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

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

## License

[MIT](https://choosealicense.com/licenses/mit/)
