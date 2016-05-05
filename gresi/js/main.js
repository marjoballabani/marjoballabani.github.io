/**
 * Call initialization function on dom load
 */
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        start();
    }
};

/**
 * Initialize distribute Function
 * Takes an HTML element where to render icons
 * and configuration to define icon distribution behaviour
 */
function start() {
    /** Get Canvas */
    var iconCanvas = document.getElementById("icon-canvas");
    /** Creates grid3 Configuration */
    var grid3config = {
        imgsPath: 'assets/imgs/icons/',
        iconBaseName: 'dd-icon',
        iconType: '.png',
        iconsNum: 28,
        distributionType: "random",
        iconSizeFactor: 50,
        magnifiedIconSizeFactor: 2.5,
        gridSize: 10,
        bgColor: "#fff",
        hRandomizingFactor: 1,
        vRandomizingFactor: 1,
        distributionFactor: 1,
        focusSpeed: 0.5,
        blurSpeed: 2,
        focusedIcons: [
        ]
    };
    grid3.build(iconCanvas, grid3config, function () {
        //setUpGrid3DataHandler(focusedIcons);
    });
}

/**
 * Handles Escape Button
 * Detets Escape Button and exits active modal
 */
function handleEscButton() {
    var modals = document.getElementsByClassName('modal');
    document.onkeydown = function (event) {
        event = event || window.evt;
        if (event.keyCode == 27) {
            for (var i = 0; i < modals.length; i++) {
                if (modals[i].getAttribute('active') == 'true') {
                    hideModal(modals[i]);
                }
            }
        }
    }
}

/**
 * Hides active Modal
 * @param modal
 */
function hideModal(modal) {
    modal.setAttribute("class", "modal animated fadeOut");
    modal.setAttribute('active', false);
    modal.style.zIndex = -1;
}

/**
 * Shows Modal
 * @param modal
 */
function showModal(modal) {
    modal.setAttribute('active', true);
    modal.style.zIndex = 999999999999999;
}

/**
 * Handles Modal Exit Buttons
 */
function handleExitButtons() {
    var exitBtns = document.getElementsByClassName('exit-btn');
    for (var i = 0; i < exitBtns.length; i++) {
        var exitBtn = exitBtns[i];
        exitBtn.onclick = function (event) {
            var target = event.target.parentNode;
            hideModal(target);
        }
    }
}

/**
 * Show main logo
 */
function showLogo() {
    document.getElementById('logo-data').style.display = "block";
}

/**
 * Hide main logo
 */
function hideLogo() {
    document.getElementById('logo-data').style.display = "none";
}

/**
 * Handle buttons
 * @param focusedIcons
 */
function setUpGrid3DataHandler(focusedIcons) {
    /** Keeps a reference of last Displayed Modal */
    var lastDisplayedModal = null;
    handleExitButtons();
    showLogo();
    for (var i = 0; i < focusedIcons.length; i++) {
        var curIcon = focusedIcons[i];
        var iconNode = document.getElementById(curIcon.id);
        iconNode.addEventListener('click', function(evt) {
            if (lastDisplayedModal) {
                hideModal(lastDisplayedModal);
            }
            var iconData = document.getElementById(evt.target.id + "-data");
            lastDisplayedModal = iconData;
            if (iconData) {
                hideLogo();
                showModal(lastDisplayedModal);
                iconData.style.display = "table";
                iconData.setAttribute("class", "modal animated fadeIn");
            }
        }, true);
    }
    handleEscButton(lastDisplayedModal);
}
