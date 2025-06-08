# Token HUD Wildcard for Foundry VTT

![Compatible Foundry Version](https://img.shields.io/badge/Foundry-v13-informational)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/mhilbrunner/token-hud-wildcard?label=Latest+Release)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftoken-hud-wildcard&colorB=4aa94a)
![GitHub Downloads All Releases](https://img.shields.io/github/downloads/mhilbrunner/token-hud-wildcard/total?label=Downloads+(Total))
![GitHub Downloads Release](https://img.shields.io/github/downloads/mhilbrunner/token-hud-wildcard/latest/total?label=Downloads+(Latest))
![GitHub Release Date](https://img.shields.io/github/release-date/mhilbrunner/token-hud-wildcard?label=Release+Date)

This [Foundry VTT](https://foundryvtt.com/) modules adds a button to the Token HUD if the token has *Randomized Wildcard Images* activated and more than 1 image.

When this HUD button is pressed, a small panel will be displayed on the right side of the token HUD with a list of buttons for each detected image from the Wildcard Images functionality.
Pressing any of these will allow to easily change the image of the Token without opening the token configuration panel.

<p style="text-align: center;">
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/hud-options1.png" alt="HUD Options" height="280" style="margin: 0 auto;" />
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/hud-options2.png" alt="HUD Options" height="280" style="margin: 0 auto;" />
</p>

*The token images were done by the amazing Ross McConnell at [2-Minute Tabletop](https://2minutetabletop.com/) and are part of the Hero Tokens 3 Pack.*

**Note:** This is an updated fork of the original module by **javieros105**. See **Contributors** below for everyone who helped out maintaining this module.
If you need something more fully featured, consider switching to [Token Variant Art](https://foundryvtt.com/packages/token-variants) or other alternatives.

## Usage

For general Token and Wildcard token information, see the Foundry article: [Foundry: Tokens](https://foundryvtt.com/article/tokens/).

Special file names can be used to override some default token settings.
It's important that each parameter is preceded by an underscore, so if you want to set up height,
there has to be a `_height<number>_` somewhere in the file name.
`<number>` can be integer or floating point number. Signs (`-`/`+`) aren't supported.

More specific parameters beat less specific ones.
For example, if you specify both `scaleX` and `scale`, `scaleX` will be used for the X scale, while Y will use `scale`.

The parsed parameters currently are:
- `height` (in grid units, `1` by default)
- `width` (in grid units, `1` by default)
- `alpha` (`0.0` to `1.0`, `1.0` by default)
- `scale`, `scaleX`, `scaleY` (this is a multiplier from `0.2` to `3.0`, `1.0` by default)
- `anchor`, `anchorX`, `anchorY` (`0.0` to `1.0`, `0.5` by default)

If any parameter is missing then the module will use the prototype token parameters as default,
so you can use images with no parameter setting at all or just set one or two of the parameters.

Some valid file name examples:

- `imagename.extension` (e.g. `mystery-man.png` or `dragon.svg`)
- `imagename_height<number>_width<number>_scale<number>_.extension`
- `imagename_height-other_height2_scale1.5_.extension`

## Installation

To install the module, follow the Foundry article on [Module Management](https://foundryvtt.com/article/modules/).

For installation by manifest URL, this is the URL: `https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/module.json`

ZIP file downloads and manifest files for specific module versions are listed under
[releases]((https://github.com/mhilbrunner/token-hud-wildcard/releases/latest/)).

## Changelog

See [Releases](https://github.com/mhilbrunner/token-hud-wildcard/releases).

## Acknowledgements

Thanks to **Atropos** and the Foundry team, **javieros105** for originally creating this module and thanks to all contributors!

## Contributors

- [@javieros105](https://github.com/javieros105): Original module
- [@arbron](https://github.com/arbron): Making the update for compatibility with 0.8.x of Foundry and fixing errors.
- [@SirTman](https://github.com/SirTman): Compatibility issue with apperance tab in prototype token foundry v9
- [@cs96and](https://github.com/cs96and): Fix of default token rendering on preCreateToken hook that created duplicates of image and didn't render the default token.
- [@MiniGrief](https://github.com/MiniGrief): Foundry v10 compatibility and bug fixes.

## License

The source code is licensed under GPL-3.0.
