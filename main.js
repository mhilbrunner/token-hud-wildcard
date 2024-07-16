Hooks.on('init', () => {
    game.settings.register('token-hud-wildcard', 'imageDisplay', {
        name: game.i18n.format('THWildcard.DisplaySettingName'),
        hint: game.i18n.format('THWildcard.DisplaySettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register("token-hud-wildcard", "imageOpacity", {
        name: game.i18n.format('THWildcard.OpacitySettingName'),
        hint: game.i18n.format('THWildcard.OpacitySettingHint'),
        scope: "client",
        config: true,
        range: { min: 0, max: 100, step: 1 },
        type: Number,
        default: 50
    });
    game.settings.register('token-hud-wildcard', 'animate', {
        name: game.i18n.format('THWildcard.AnimateSettingName'),
        hint: game.i18n.format('THWildcard.AnimateSettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register('token-hud-wildcard', 'parseFileNames', {
        name: game.i18n.format('THWildcard.parseSettingName'),
        hint: game.i18n.format('THWildcard.parseSettingHint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register('token-hud-wildcard', 'rightClickRandomize', {
        name: game.i18n.format('THWildcard.randomizeSettingName'),
        hint: game.i18n.format('THWildcard.randomizeSettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register('token-hud-wildcard', 'rightClickShare', {
        name: game.i18n.format('THWildcard.shareSettingName'),
        hint: game.i18n.format('THWildcard.shareSettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
});

Hooks.on('ready', () => {
    Hooks.on('renderTokenConfig', renderTokenConfig);
    Hooks.on('preCreateToken', (parent, data, options, userId) => {
        const defaultValue = parent?.actor?.prototypeToken?.getFlag('token-hud-wildcard', 'default');
        if (defaultValue && parent?.actor?.prototypeToken?.randomImg) {
            updateTokenImage(parent, defaultValue, { updateDocument: false, updateSource: true });
        }
    });
});

async function renderTokenConfig(config, html) {
    const defaultImg = await getDefaultImg(config.token);
    if (config.token._id) {
        return;
    }
    const imageDataTab = html.find('.tab[data-tab="appearance"],.tab[data-tab="image"]');
    const checkBoxWildcard = imageDataTab.find('input[name="randomImg"]');
    const configField = await renderTemplate(
        '/modules/token-hud-wildcard/templates/configField.html',
        { defaultImg, available: checkBoxWildcard[0].checked });

    imageDataTab.append(configField);
    const defaultConfig = imageDataTab.find('.thwildcard-default');

    defaultConfig.find('button').click(event => {
        event.preventDefault();
        const input = defaultConfig.find('input')[0];

        const fp = new FilePicker({ current: input.value, field: input });
        fp.browse(defaultImg);
    });

    checkBoxWildcard.click(event => {
        if (event.target.checked) {
            defaultConfig[0].classList.add('active');
        } else {
            defaultConfig[0].classList.remove('active');
        }
    });
}

Hooks.on('renderTokenHUD', async (app, html, context) => {
    if (!canvas.tokens.controlled) {
        return;
    }

    const token = canvas.tokens.controlled[canvas.tokens.controlled.length - 1];
    if (!token) {
        return;
    }

    const images = await getTokenImages(token);
    if (images.length < 2) {
        return;
    }

    const imageDisplay = game.settings.get('token-hud-wildcard', 'imageDisplay');
    const imageOpacity = game.settings.get('token-hud-wildcard', 'imageOpacity') / 100;
    const wildcardDisplay = await renderTemplate('/modules/token-hud-wildcard/templates/hud.html', { images, imageDisplay, imageOpacity });

    html.find('div.right')
        .append(wildcardDisplay)
        .click((event) => {
            let activeButton, clickedButton, tokenButton;
            for (const button of html.find('div.control-icon')) {
                if (button.classList.contains('active')) activeButton = button;
                if (button === event.target.parentElement) clickedButton = button;
                if (button.dataset.action === 'thwildcard-selector') tokenButton = button;
            }

            if (clickedButton === tokenButton && activeButton !== tokenButton) {
                tokenButton.classList.add('active');
                html.find('.thwildcard-selector-wrap')[0].classList.add('active');
                const effectSelector = '[data-action="effects"]';
                html.find(`.control-icon${effectSelector}`)[0].classList.remove('active');
                html.find('.status-effects')[0].classList.remove('active');
            } else {
                tokenButton.classList.remove('active');
                html.find('.thwildcard-selector-wrap')[0].classList.remove('active');
            }
        })
        .contextmenu(async (event) => {
            if (event.target?.parentElement?.dataset?.action !== 'thwildcard-selector') {
                return;
            }
            if (!game.settings.get('token-hud-wildcard', 'rightClickRandomize')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            const randomImg = await getRandomTokenImage(token);
            if (randomImg?.route) {
                updateTokenImage(token, randomImg.route);
            }
        });

    const buttons = html.find('.thwildcard-button-select');

    buttons.map((button) => {
        buttons[button].addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            updateTokenImage(token, event.target.dataset.name)
        });
        buttons[button].addEventListener('contextmenu', function (event) {
            if (!game.settings.get('token-hud-wildcard', 'rightClickShare')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            new ImagePopout(event.target.dataset.name, {
                title: token.name,
                shareable: token.actor?.isOwner ?? game.user?.isGM,
                uuid: token.actor?.uuid
            }).render(true);
        });
    });
});

function updateTokenImage(token, img, opts = { updateSource: false, updateDocument: true }) {
    let updateInfo = getTokenDimensions(token, img);
    updateInfo["texture.src"] = img;
    const shouldAnimate = game.settings.get('token-hud-wildcard', 'animate');

    if (opts.updateSource) {
        token.updateSource(updateInfo);
    }

    if (opts.updateDocument) {
        token.document.update(updateInfo, {animate: shouldAnimate});
    }
}

async function getRandomTokenImage(token) {
    if (!token) {
        return;
    }
    const images = await getTokenImages(token);
    if (!images || images.length < 2) {
        return;
    }
    return images[Math.floor(Math.random()*images.length)]
}

async function getTokenImages(token) {
    if (!token) {
        return [];
    }

    const actor = token.actor;
    const images = await actor?.getTokenImages();
    if (!images || images.length < 2) {
        return [];
    }

    const imagesParsed = images.map(im => {
        const name = im.split('/').pop();
        const extension = im.split('.').pop().toLowerCase();
        const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
        const vid = ['webm', 'mp4', 'm4v'].includes(extension);
        return { route: im, name: name, used: im === token.texture.src, img, vid, type: img || vid };
    });

    if (!imagesParsed) {
        return [];
    }

    return imagesParsed;
}

async function getDefaultImg(token) {
    const flag = token?.getFlag('token-hud-wildcard', 'default') || '';
    return flag;
}

var TOKENHUD_VAR_REGEX = {};

function extractNumVar(str, varName, defaultValue = undefined) {
    if (!str || !varName || !game.settings.get('token-hud-wildcard', 'parseFileNames')) {
        return defaultValue;
    }

    const prefix = '_' + varName;
    if (!TOKENHUD_VAR_REGEX[varName]) {
        TOKENHUD_VAR_REGEX[varName] = new RegExp(prefix + '([0-9]*[.])?[0-9]+');
    }

    var val = str.match(TOKENHUD_VAR_REGEX[varName]);
    if (!val || val.length < 1) {
        return defaultValue;
    }

    val = val[0].replace(prefix, '');
    val = parseFloat(val);

    if (isNaN(val)) {
        return defaultValue;
    }

    return val;
}

function getTokenDimensions(token, imgName) {
    var prototypeData = token?.actor?.prototypeToken;
    var dimensionData = {
        height: extractNumVar(imgName, 'height', prototypeData?.height),
        width: extractNumVar(imgName, 'width', prototypeData?.width),
        "texture.scaleX": extractNumVar(imgName, 'scale', prototypeData?.texture.scaleX),
        "texture.scaleY": extractNumVar(imgName, 'scale', prototypeData?.texture.scaleY),
    }
    return dimensionData;
}
