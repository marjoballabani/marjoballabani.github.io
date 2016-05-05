/**
 * Creates a grid layout which distributes
 * icons in a fashion defined by given
 * configuration
 *
 * @author Kostandin Angjellari
 */
var grid3 = (function () {

    var canvas, canvasHeight, canvasWidth;
    var iconStyle, iconFocusStyle;
    var cfg = null;
    var finishedCB = null;

    /**
     * Gets css from file in same directory
     * @param callback
     */
    function getCSSStyle(sucessCB, actionCB) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var cssFile = xmlhttp.responseText;
                sucessCB(cssFile);
                actionCB();
            }
        };
        xmlhttp.open("GET", "libb/grid3/grid3.css", true);
        xmlhttp.send();
    }

    /** Append css to body **/
    function onCSSLoaded(styleText) {
        /**
         * Create style element and append it to document element
         * @type {HTMLElement}
         */
        var styleEl = document.createElement("style");
        styleEl.id = "grid3style";
        styleEl.innerHTML = styleText;
        document.head.appendChild(styleEl);
        setIconStyles();
    }

    /**
     * Sets iconStyle and
     * iconFocus style from dynamic style
     */
    function setIconStyles() {
        var currentStyleSheet;
        for (var i = 0; i < document.styleSheets.length; i++) {
            currentStyleSheet = document.styleSheets[i];
            if (currentStyleSheet.ownerNode.id == "grid3style") {
                iconStyle = currentStyleSheet.cssRules[0].style;
                iconFocusStyle = currentStyleSheet.cssRules[1].style;
                break;
            }
        }
    }

    /**
     * Sets up canvas height and width
     */
    function setUpCanvasDimensions() {
        canvasHeight = canvas.clientHeight;
        canvasWidth = canvas.clientWidth;
    }

    /**
     * Gets actual width of document
     * @returns {Number|number}
     */
    function getActualWidth() {
        var actualWidth = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth ||
            document.body.offsetWidth;
        return actualWidth;
    }

    /**
     * Sets icon style
     */
    function setStyling(hCellNum, vCellNum) {
        var cellHeight = Math.floor(canvasHeight / hCellNum);
        var iconHeight = cellHeight - (cellHeight / cfg.iconSizeFactor) + 20;
        if (canvasWidth < 420) {
            iconHeight = 30;
        }
        iconStyle.padding = cellHeight / 2 + "px";
        if (canvasWidth < 700) iconStyle.padding = "0";
        iconStyle.height = iconHeight + "px";
        /*iconFocusStyle.height = iconHeight + (cellHeight / cfg.magnifiedIconSizeFactor) + "px";*/
        iconFocusStyle.transform = "scale(" + cfg.magnifiedIconSizeFactor + "," + cfg.magnifiedIconSizeFactor + ")";
        /*iconFocusStyle.marginTop = - Math.floor((cellHeight / cfg.magnifiedIconSizeFactor) / 2) + "px";
         iconFocusStyle.marginLeft = - Math.floor((cellHeight / cfg.magnifiedIconSizeFactor) / 2) + "px";*/
        iconStyle.transitionDuration = cfg.blurSpeed + "s";
        iconFocusStyle.transitionDuration = cfg.focusSpeed + "s";
        canvas.style.backgroundColor = cfg.bgColor;
    }


    /**
     * Play animation on icons show
     * @param focusedIcons
     */
    function applyIconsAnimation(focusedIcons) {
        var i = 0;
        focusedIcons.forEach(function (icon) {
            setTimeout(function () {
                bounceIcon(document.getElementById(icon.id));
            }, i * 600);
            i++;
        });
    }

    /**
     * Bounces icon
     * @param icon
     */
    function bounceIcon(icon) {
        setTimeout(function () {
            icon.style.transform = "scale(5,5)";
        }, 300);
        setTimeout(function () {
            icon.style.transform = "scale(1,1)";
        }, 800);
        setTimeout(function () {
            icon.style.transform = "";
        }, 1500);
    }

    /**
     * Gets icon name by fashion defined from config
     * @param index
     * @returns Name
     */
    function getIconName(index) {
        var iconName;
        if (cfg.distributionType == "random") {
            iconName = Math.round((Math.random() * 29) % (cfg.iconsNum - 1)) + 1;
        } else if (cfg.distributionType == "default") {
            iconName = (index + 1) % ((cfg.iconsNum - 1) + 1);
        }
        return iconName;
    }

    /**
     * Creates an icon title
     * @param title
     * @returns {*}
     */
    function createIconTitle(title) {
        var titleElement = document.createElement('div');
        /**
         * No rotation
         */
        //titleElement.setAttribute('style', 'position: absolute; color: #aaa; margin-top: -20px; text-align: center; font-size: 16px; color: rgba(223,73,27,1); text-');
        /**
         * Rotation
         */
        titleElement.setAttribute('style', 'position: absolute;margin-top: -20px;text-align: center;font-size: 14px;color: #FFF; text-transform: uppercase;');
        titleElement.innerHTML = title;
        return titleElement;
    }

    /**
     * Based on configuration creates
     * a grid distribution of icons
     */
    function distributeGrid() {
        var curTD, curTR, iconName, icon, iconIndex = 0;
        var gridTable = document.createElement('table');
        var focusableCells = [];
        gridTable.className = 'icons-grid';
        gridTable.cellPadding = 0;
        gridTable.cellSpacing = 0;
        /**
         * Get number of horizontal and vertical cells
         * @type {number}
         */
        var hCellNum = 20;
        var vCellNum = 12;
        setStyling(hCellNum, vCellNum);
        /**
         * Populate grid
         */
        for (var i = 0; i < vCellNum; i++) {
            curTR = document.createElement('tr');
            for (var j = 0; j < hCellNum; j++) {
                iconIndex++;
                curTD = document.createElement('td');
                /** Zigzag pattern. Add icons one at 2 **/
                if ((i + j) % 2 != 0) {
                    icon = new Image();
                    icon.src = cfg.imgsPath + cfg.iconBaseName + getIconName(iconIndex) + cfg.iconType;
                    curTD.appendChild(icon);
                } else {
                    curTD.className = "no-icon"
                }
                curTR.appendChild(curTD);
            }
            gridTable.appendChild(curTR);
        }
        canvas.appendChild(gridTable);
        /** Keep a reference of focusable icons **/
        var focusedItems = cfg.focusedIcons.slice();
        //applyIconsAnimation(focusedItems);
        finishedCB();
    }

    return {
        build: function (renderElement, config, sucessCB) {
            /** Get configuration and render element **/
            cfg = config;
            canvas = renderElement;
            finishedCB = sucessCB;

            /** Define canvas height and width **/
            setUpCanvasDimensions();

            /** Gets css and update in dom and starts distributing icons**/
            getCSSStyle(onCSSLoaded, distributeGrid);

            console.log("grid3 success");
        }
    }

})();