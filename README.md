# Token HUD Wildcard for Foundry VTT

![Compatible Foundry Version](https://img.shields.io/badge/Foundry-v12-informational)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/mhilbrunner/token-hud-wildcard?label=Latest+Release)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftoken-hud-wildcard&colorB=4aa94a)
![GitHub Downloads All Releases](https://img.shields.io/github/downloads/mhilbrunner/token-hud-wildcard/total?label=Downloads+(Total))
![GitHub Downloads Release](https://img.shields.io/github/downloads/mhilbrunner/token-hud-wildcard/latest/total?label=Downloads+(Latest))
![GitHub Release Date](https://img.shields.io/github/release-date/mhilbrunner/token-hud-wildcard?label=Release+Date)

This is a really simple module for [Foundry VTT](https://foundryvtt.com/) that adds a button to the Token HUD if the corresponding token has *Randomized Wildcard Images* activated and more than 1 detected image.

When this HUD button is pressed, a small panel will be displayed on the right side of the token HUD with a list of buttons for each detected image from the Wildcard Images functionality.
Pressing any of these will allow to easily change the image of the Token without opening the token configuration panel.

<p style="text-align: center;">
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/prototype-config.png" alt="Prototype Config" width="500"/>
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/settings.png" alt="HUD Button" height="150"/>
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/hud-options1.png" alt="HUD Options" height="280"/>
<img src="https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/images/hud-options2.png" alt="HUD Options" height="280"/>
</p>

*The token images were done by the amazing Ross McConnell at [2-Minute Tabletop](https://2minutetabletop.com/) and are part of the Hero Tokens 3 Pack.*

**NOTE:** This is a updated fork of the original module by **javieros105**. See **Contributors** below for everyone who helped out maintaining this module.
If you need something more fully featured, consider switching to [Token Variant Art](https://foundryvtt.com/packages/token-variants) or other alternatives.

## Compatibility and Known Issues

- The module only works for users with file browser permissions, as those are required for `Actor.getTokenImages()`.

## Usage

To use this module you can choose in settings if you want to display the available token images as a list of file names or as a list of thumbnails.

Configuring your Token is done via the Wildcard Images method, open the prototype token configuration and in the "Token Image Path" field choose a path with a * that represents a wild card, any image that follow the pattern of that path will be considered in the possible images of the token.

Check the box "Randomize Wildcard Images", this will activate the wildcard and any time you drop a token in the canvas a random image will be chosen according to the path pattern.

When you have the token in the canvas, opening it's HUD will show a new button if the Token has more than one image to choose from, and depending on the setting it will show the options as a file name or image (default setting is as images), pressing any of these will change the token image.

If you don't want the image on drop to be chosen randomly, you can use the field in the "wildcard drop default" box in the prototype token configuration window. Picking a file here will make it the default image when dropping a new token, if you want it to be random leave it empty.

If you're gonna use the default image field, I recommend you use an image file that follows the wildcard pattern. but it's not required and you can have a different default image. If you choose an image that doesn't follow the pattern you just won't be able to pick it again after changing it in the images panel.

You can also use the image filename to set the dimensions of the token using the following example format:

- wildcard images use this pattern `name*`
- `name_height<number>_width<number>_scale<number>_.extension`, it's important that each parameter s preceded and followed by an underscore, so if you want to set up height, there has to be a `_height<number>_` somewhere in the name
- you can choose to change `<number>` for a positive integer or floating number and which one to fill. If there are any parameter missing then the module will use the prototype token parameters to fill the ones missing, so you can use images with no parameter setting at all or just set one or two of the parameters.
- these are valid filenames that will be picked up by the module `name.extension`, `name-different.extension`, `name-other_height2_scale1.5_.extension`

## Installation

To install the module, follow any of these methods:

### Method 1 (Recommended)

- Use Foundry's Package Manager to search for and install the package.

### Method 2

- Start up Foundry and in the "Add-on Modules" tab click "Install Module".
- In the "Manifest URL" field, paste the link: `https://raw.githubusercontent.com/mhilbrunner/token-hud-wildcard/master/module.json`
- Click "Install" and wait for it to finish.
- It should be installed and available in your games.

### Method 3

- Download the [.zip file](https://github.com/mhilbrunner/token-hud-wildcard/releases/latest/).
- Extract the contents of the zip in your modules folder.
- Restart Foundry and it should be available for your games.

## Changelog

See [Releases](https://github.com/mhilbrunner/token-hud-wildcard/releases).

## Acknowledgements

Thanks to Atropos for making this amazing platform for roleplaying games. I've enjoyed it a ton and the possibility of expanding functionalities and adding your own is just awesome.

Also thanks to all the module developers that have allowed me to enjoy this software even more and that were the basis for making my own little module.

## Contributors

- [@javieros105](https://github.com/javieros105): Original module
- [@arbron](https://github.com/arbron): Making the update for compatibility with 0.8.x of Foundry and fixing errors.
- [@SirTman](https://github.com/SirTman): Compatibility issue with apperance tab in prototype token foundry v9
- [@cs96and](https://github.com/cs96and): Fix of default token rendering on preCreateToken hook that created duplicates of image and didn't render the default token.
- [@MiniGrief](https://github.com/MiniGrief): Foundry v10 compatibility and bug fixes.

## License

The source code is licensed under GPL-3.0.
