Hooks.on('init', () => {
    game.settings.register('token-hud-wildcard', 'imageDisplay', {
        name: game.i18n.format('THWildcard.DisplaySettingName'),
        hint: game.i18n.format('THWildcard.DisplaySettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register('token-hud-wildcard', 'tooltips', {
        name: game.i18n.format('THWildcard.TooltipsSettingName'),
        hint: game.i18n.format('THWildcard.TooltipsSettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register('token-hud-wildcard', 'videoAutoplay', {
        name: game.i18n.format('THWildcard.VideoAutoplaySettingName'),
        hint: game.i18n.format('THWildcard.VideoAutoplaySettingHint'),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
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
    Hooks.on('renderPrototypeTokenConfig', renderTokenConfig);
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
    const imageDataTab = html.querySelector('.tab[data-tab="appearance"],.tab[data-tab="image"]');
    const checkBoxWildcard = imageDataTab?.querySelector('input[name="randomImg"]');
    const configField = await renderTemplate(
        '/modules/token-hud-wildcard/templates/configField.html',
        { defaultImg, available: checkBoxWildcard?.checked });

    imageDataTab?.insertAdjacentHTML('beforeend', configField);
    const defaultConfig = imageDataTab.querySelector('.thwildcard-default');
    const defaultImgButton = defaultConfig?.querySelector('button');
    defaultImgButton?.addEventListener('click', (event) => {
        event.preventDefault();
        const input = defaultConfig.querySelector('input');
        if (!input) return;
        const fp = new FilePicker({ current: input.value, field: input });
        fp.browse(defaultImg);
    });

    checkBoxWildcard?.addEventListener('click', event => {
        if (event.target.checked) {
            defaultConfig.classList.add('active');
        } else {
            defaultConfig.classList.remove('active');
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
    const videoAutoplay = game.settings.get('token-hud-wildcard', 'videoAutoplay');
    const tooltips = game.settings.get('token-hud-wildcard', 'tooltips');
    const wildcardDisplay = await renderTemplate('/modules/token-hud-wildcard/templates/hud.html',
        { images, imageDisplay, videoAutoplay, tooltips });

    let right = html.querySelector('div.right');
    right?.insertAdjacentHTML('beforeend', wildcardDisplay);
    right?.addEventListener('click', async (event) => {
        let activeButton, clickedButton, tokenButton;
        for (const button of html.querySelectorAll('div.control-icon')?.values()) {
            if (button.classList.contains('active')) activeButton = button;
            if (button === event.target.parentElement) clickedButton = button;
            if (button.dataset.action === 'thwildcard-selector') tokenButton = button;
        }

        if (clickedButton === tokenButton && activeButton !== tokenButton) {
            tokenButton.classList.add('active');
            html.querySelector('.thwildcard-selector-wrap')?.classList.add('active');
            const effectSelector = '[data-action="effects"]';
            html.querySelector(`.control-icon${effectSelector}`)?.classList.remove('active');
            html.querySelector('.status-effects')?.classList.remove('active');
        } else {
            tokenButton.classList.remove('active');
            html.querySelector('.thwildcard-selector-wrap')?.classList.remove('active');
        }
    });
    right.addEventListener('contextmenu', async (event) => {
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

    const buttons = html.querySelectorAll('.thwildcard-button-select');

    for (const button of buttons?.values()) {
        const imgName = button.querySelector('span, .thwildcard-button-image')?.dataset?.name;
        if (!imgName) continue;

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const menuActive = button?.parentElement?.classList?.contains('active');
            if (menuActive) {
                updateTokenImage(token, imgName);
            }
        });

        button.addEventListener('contextmenu', function (event) {
            if (!game.settings.get('token-hud-wildcard', 'rightClickShare')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            new ImagePopout(imgName, {
                title: token.document.name,
                shareable: token.isOwner ?? game.user?.isGM,
                uuid: token.actor?.uuid
            }).render(true);
        });
    }
});

function updateTokenImage(token, img, opts = { updateSource: false, updateDocument: true }) {
    let updateInfo = getTokenDimensions(token, img);
    updateInfo['texture.src'] = img;
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
        return { route: im, name: name, used: im === token.document.texture.src, img, vid, type: img || vid };
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
    var dimensionData = {};
    dimensionData['height'] = extractNumVar(imgName, 'height', prototypeData?.height ?? 1);
    dimensionData['width'] = extractNumVar(imgName, 'width', prototypeData?.height ?? 1);
    dimensionData['alpha'] = extractNumVar(imgName, 'alpha', prototypeData?.alpha ?? 1);
    // Scale
    dimensionData['texture.scaleX'] = extractNumVar(imgName, 'scale', prototypeData?.texture.scaleX ?? 1);
    dimensionData['texture.scaleY'] =  extractNumVar(imgName, 'scale', prototypeData?.texture.scaleY ?? 1);
    dimensionData['texture.scaleX'] =  extractNumVar(imgName, 'scaleX', dimensionData['texture.scaleX']);
    dimensionData['texture.scaleY'] =  extractNumVar(imgName, 'scaleY', dimensionData['texture.scaleY']);
    // Anchor
    dimensionData['texture.anchorX'] =  extractNumVar(imgName, 'anchor', prototypeData?.texture.anchorX ?? 0.5);
    dimensionData['texture.anchorY'] =  extractNumVar(imgName, 'anchor', prototypeData?.texture.anchorY ?? 0.5);
    dimensionData['texture.anchorX'] =  extractNumVar(imgName, 'anchorX', dimensionData['texture.anchorX']);
    dimensionData['texture.anchorY'] =  extractNumVar(imgName, 'anchorY', dimensionData['texture.anchorY']);
    return dimensionData;
}
