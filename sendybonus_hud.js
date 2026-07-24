function AddHud() {
    let hudStyleElement;
    let loadingNotification;

    // ============ Loading Notification ============
    function showLoadingNotification() {
        if (document.getElementById('loadingNotification')) return;
        loadingNotification = document.createElement('div');
        loadingNotification.id = 'loadingNotification';
        loadingNotification.style.cssText = 'position:fixed;bottom:10%;left:50%;transform:translateX(-50%);display:flex;align-items:center;padding:10px 20px;background:rgba(0,0,0,0.8);color:#fff;font-family:GothamPro,sans-serif;font-size:16px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.3);opacity:0;transition:opacity 2.5s;z-index:1000;';
        var spinner = document.createElement('div');
        spinner.style.cssText = 'width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top:3px solid #fff;border-radius:50%;margin-right:10px;animation:sbSpin 1s linear infinite;';
        var text = document.createElement('span');
        text.textContent = 'SendyBonus';
        loadingNotification.appendChild(spinner);
        loadingNotification.appendChild(text);
        document.body.appendChild(loadingNotification);
        var s = document.createElement('style');
        s.textContent = '@keyframes sbSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';
        document.head.appendChild(s);
        setTimeout(function() { loadingNotification.style.opacity = '1'; }, 10);
    }
    showLoadingNotification();

    window.sbHud = window.sbHud || {};

    function formatNumberWithDots(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // ============ Config ============
    var config = {
        serverName: 'SendyBonus',
        logoUrl: '',
        bonusMultiplier: 3,
        accentColor: '#FF3676',
        accentGradient: 'linear-gradient(135deg, #FF3676 0%, #FF6B35 100%)'
    };

    var icons = {
        health: '', armour: '', hunger: '', breath: '', cash: '',
        wanted_active: '', wanted_inactive: '', weapon_back: '', zone: '', circle: ''
    };

    var weaponIcons = {};
    for (var i = 0; i <= 46; i++) weaponIcons[i] = '';
    var logoImages = {};
    for (var i = 1; i <= 21; i++) logoImages[i] = '';

    // ============ Create HUD ============
    function createHud() {
        hudStyleElement = document.createElement("style");
        hudStyleElement.id = "sbHudStyles";
        hudStyleElement.innerHTML = '\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Black/GothamPro-Black.ttf) format("truetype");font-weight:900;font-style:normal}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-BlackItalic/GothamPro-BlackItalic.ttf) format("truetype");font-weight:900;font-style:italic}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Bold/GothamPro-Bold.ttf) format("truetype");font-weight:700;font-style:normal}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Medium/GothamPro-Medium.ttf) format("truetype");font-weight:500;font-style:normal}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Regular/GothamPro.ttf) format("truetype");font-weight:400;font-style:normal}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Light/GothamPro-Light.ttf) format("truetype");font-weight:300;font-style:normal}\
@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-LightItalic/GothamPro-LightItalic.ttf) format("truetype");font-weight:300;font-style:italic}\
@font-face{font-family:ALSRubl;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/ALSRubl.ttf) format("truetype");font-weight:400;font-style:normal}\
@font-face{font-family:SAfonts;font-weight:600;font-style:normal;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/SAfonts-Regular.ttf) format("truetype")}\
@font-face{font-family:BankGothic;font-weight:500;font-style:normal;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/BankGothicRUSSMedium.ttf) format("truetype")}\
@font-face{font-family:PricedownRus;font-weight:400;font-style:normal;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/PricedownRus.ttf) format("truetype")}\
\
#app .hud-radmir-wanted{display:none}\
body #app .hud-radmir-info{display:none}\
.hud-hassle-map .map-mask{display:none}\
\
.Old-Fixed-Hud{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999}\
.Old-Fixed-Logo img,.Old-Fixed-HudTop{transform-origin:top right}\
.Ammo-in-clip{font-family:GothamPro;font-weight:700;font-style:italic}\
.Old-Fixed-HudTop{position:absolute;right:1.4vw;top:3.4vh;display:flex;flex-direction:column;align-items:flex-end;transform-origin:top right}\
.Old-Fixed-Logo{position:relative;margin-bottom:3vh}\
.Old-Fixed-Logo img{width:20.52vh;height:6.2vh;margin-right:2vh}\
.Old-Fixed-Bonus{background-color:rgba(0,0,0,1);width:33px;height:33px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;font-weight:700;position:absolute;bottom:-5px;right:-2px;border-radius:50%;font-family:GothamPro;font-size:1.49vh}\
.Old-Fixed-Main,.Old-Fixed-Cash,.Wanted_row{align-items:center;display:flex}\
.Old-Fixed-Main{margin-top:.46vh;margin-right:3.46vh}\
.Old-Fixed-Weapon{width:16.6vh;height:16.6vh;position:relative;display:flex;justify-content:flex-end;margin-left:-.93vh;margin-right:.46vh}\
.Ammo-in-clip,.old-param__icon{margin-right:0.8vh}\
.Old-Fixed-Weapon_back{position:absolute;right:-1.4vh;top:-1.6vh;z-index:-1}\
.Old-Fixed-Weapon_icon{width:40vh;height:17.6vh}\
.Old-Fixed-Weapon_ammo{position:absolute;bottom:5.6vh;right:6vh;display:flex;align-items:flex-end;color:#fff;gap:3.4vh}\
.Ammo-in-clip{font-family:GothamPro;font-weight:700;font-style:italic;font-size:2.31vh;line-height:1;text-shadow:0 0 .46vh #00000080}\
.Ammo-full{font-family:GothamPro;font-weight:300;font-style:italic;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3;margin-left:0.4vh}\
.Old-Fixed-Params{height:13.5vh;position:relative;z-index:1}\
.Old-Fixed-Cash{justify-content:flex-end;color:white;font-family:GothamPro;font-weight:900;font-style:italic;font-size:2.59vh;text-shadow:0 0 .46vh #000000cb}\
.Old-Fixed-Cash img{margin-right:13px;margin-top:1px}\
.Old-Fixed-Params__all{margin-top:1vh}\
.Old-Fixed-Param{display:flex;align-items:center;margin-top:.95vh}\
.Old-Fixed-Param.health{margin-top:0;margin-left:1.89vh}\
.Old-Fixed-Param.armour,.Old-Param-Values{margin-left:.93vh}\
.Old-Param-Progress,.Old-Progress__Values{width:9.40vh;height:.46vh;background-color:#0000004d;border-radius:.46vh}\
.Old-Progress__Values{display:flex;justify-content:flex-end}\
.Old-Progress__Values .circle{width:.85vh;height:.93vh;margin-top:-.25vh;margin-right:-.28vh}\
.Old-Param-Values{font-family:GothamPro;font-weight:300;font-style:italic;color:white;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3}\
.Old-Fixed-Freeze_text{margin-right:1vh}\
.Old-Fixed-Freeze_value,.Old-Fixed-Freeze_text{font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:2vh;text-shadow:0 0 2vh #000}\
.Old-Fixed-Param.hunger{margin-left:-0.25vh}\
.Old-Fixed-Param.breath{margin-left:0px;display:none}\
.Old-Fixed-Param.health .Old-Progress__Values{background-color:rgba(237,46,46,1);box-shadow:#ed2e2e01 0 0 .46vh 0}\
.Old-Fixed-Param.armour .Old-Progress__Values{background-color:rgba(82,110,230,1);box-shadow:#526ee601 0 0 .46vh 0}\
.Old-Fixed-Param.hunger .Old-Progress__Values{width:50%;box-shadow:#ff872e01 0 0 5px 0;background-color:rgba(255,135,46,1)}\
.Old-Fixed-Param.breath .Old-Progress__Values{background-color:rgba(79,195,247,1);box-shadow:#4fc3f701 0 0 .46vh 0}\
.Old-Fixed-Wanted{position:relative;margin-right:6vh;margin-top:-1.6vh;transform:translateY(60%)}\
.Old-Fixed-Wanted_back{position:absolute;right:-1.2vh;top:-0.66vh;z-index:-1}\
.Wanted_row{display:flex;flex-direction:row-reverse;align-items:center}\
.Wanted_row img{width:2.3vh;height:1.8vh;padding:0.19vh 0.28vh}\
.Old-Fixed-HudBottom{transform-origin:right bottom;position:absolute;right:0;top:20px}\
.Old-Fixed-Freeze{position:absolute;background:hsl(190deg 63% 66% / 40%);width:26.1111vh;height:0.65vh;border-radius:1vh;outline:hsl(0deg 0% 0% / 20%) 0.2vh solid;outline-offset:0.1vh;overflow:hidden;left:11.1620vh;bottom:2.7778vh}\
\
#app .hud-radmir-radar__map{width:21.9vh !important;height:20.9vh !important;overflow:hidden;display:flex;justify-content:center;align-items:center;border-radius:2vh;border:0.60vh solid #FF3676 !important}\
body #app .hud-radmir-radar__map{transition:.3s}\
#app .hud-hassle-map{width:32vh !important;height:32vh !important}\
#app .hud-radmir-radar__radar{width:26.3vh}\
#app .hud-radmir-radar{left:7.8vh;bottom:4.03vh}\
#app .hud-radmir-radar__radar-border{display:none !important}\
#app .hud-radmir-radar__radar-border_new-year{display:none !important}\
#app .hud-radmir-radar__radar-border_helloween{display:none !important}\
#app .hud-radmir-radar__radar-bats{display:none !important}\
\
body .authorization{background:0 0 !important}\
#app .authorization{background-image:none !important;background-size:auto 100vh !important}\
\
body .info-card{background:rgba(0,0,0,0.8);border-radius:31px !important}\
body .info-card__data{background:rgba(0,0,0,0.8);border-radius:31px}\
body .info-card .text{color:#cfcfcf}\
\
#app .modal-container-wrapper{background:rgba(0,0,0,0.8) !important;border:0.19vh solid #ffffff0d;border-radius:2.5vh !important}\
#app .modal-light__light{background:none !important}\
#app .modal-light__light_second{background:none !important}\
#app .modal-overlay{background:none !important}\
#app .modal_violet .modal-container{border-top:none !important}\
#app .modal_violet .modal-container-wrapper{box-shadow:none !important}\
#app .modal_orange .modal-container{border-top:none !important}\
#app .modal_orange .modal-container-wrapper{box-shadow:none !important}\
#app .modal_green .modal-container{border-top:none !important}\
#app .modal_green .modal-container-wrapper{box-shadow:none !important}\
#app .modal_red .modal-container{border-top:none !important}\
#app .modal_red .modal-container-wrapper{box-shadow:none !important}\
#app .modal_dark-orange .modal-container{border-top:none !important}\
#app .modal_dark-orange .modal-container-wrapper{box-shadow:none !important}\
\
#app .radmir-chat-input__input{background:rgba(0,0,0,0.8) !important;border-radius:11px !important;border:1px solid rgba(255,255,255,0.08) !important}\
#app .radmir-chat-input__input input{margin-left:.9vh !important;color:#fff !important}\
#app .radmir-chat-input__input-lang{margin-right:1vh !important}\
#app .controls-button{border-radius:.5vh}\
\
#app .trade-items{background:none}\
#app .trade-items__container{border-radius:10px;background:rgba(0,0,0,0.8) !important}\
\
#app .inventory{background:none}\
#app .inventory-container__info__container{background:rgba(0,0,0,0.8) !important;border-radius:1.1vh}\
#app .inventory-action__modal,#app .inventory-extra__container,#app .inventory-main{background:rgba(0,0,0,0.8)}\
#app .inventory-main__after,#app .inventory-main__before{display:none}\
#app .inventory-extra__container,#app .inventory-main{padding:2vh;background:rgba(0,0,0,0.8);border-radius:1.1vh;border:0}\
#app .inventory-capacity,#app .inventory-container__box{border-radius:1vh;border:.1vh solid #ffffff26;background:radial-gradient(#00000003,#ffffff26 150%)}\
#app .inventory-container__slot{border-radius:1vh;background:radial-gradient(#00000003,#ffffff33)}\
\
#app .fuel__container{background:rgba(0,0,0,0.8);padding:3.33vh 2.96vh}\
#app .fuel__title{font-size:2.04vh;color:#fff;text-align:left}\
#app .fuel__button{background:linear-gradient(185.93deg,#fff -22.13%,#e6e6e6 122.51%) !important;color:rgba(0,0,0,0.8) !important}\
#app .fuel__class-col.selected,.fuel__class-col:hover{background:#fff !important;color:rgba(0,0,0,0.8) !important}\
\
#app .death{font-style:italic;background:rgba(0,0,0,0.74) !important}\
#app .death-timer{font-style:italic}\
\
#app .player-interaction__container{background:rgba(0,0,0,0.8);border:none}\
#app .player-interaction__title,.player-interaction__title_active{color:#ffffff !important}\
#app .player-interaction__icon{fill:white}\
#app .player-interaction-favorite{background:rgba(0,0,0,0.8)}\
#app .player-interaction-favorite:hover{background:rgba(63,63,63,0.8)}\
#app .player-interaction__container:after,.player-interaction__container:before{background:0 0 !important}\
#app .vue3-slider .track-filled,.vue3-slider .handle{background-color:#ffffff !important}\
#app .container{background:rgba(0,0,0,0.8)}\
';
        document.head.appendChild(hudStyleElement);

        var hudElement = document.createElement("div");
        hudElement.id = 'OldHudContainer';
        hudElement.innerHTML = '\
<div class="Old-Fixed-Hud">\
<div class="Old-Fixed-HudTop">\
<div class="Old-Fixed-Logo">\
<img src="' + logoImages[1] + '">\
<div class="Old-Fixed-Bonus">x3</div>\
</div>\
<div class="Old-Fixed-Main">\
<div class="Old-Fixed-Params">\
<div class="Old-Fixed-Cash"><img src="' + icons.cash + '"><span>0</span></div>\
<div class="Old-Fixed-Params__all">\
<div class="Old-Fixed-Param health">\
<img src="' + icons.health + '" class="old-param__icon">\
<div class="Old-Param-Progress"><div class="Old-Progress__Values" style="width:100%"><img src="' + icons.circle + '" class="circle"></div></div>\
<span class="Old-Param-Values">100</span>\
</div>\
<div class="Old-Fixed-Param armour">\
<img src="' + icons.armour + '" class="old-param__icon">\
<div class="Old-Param-Progress"><div class="Old-Progress__Values" style="width:0%"><img src="' + icons.circle + '" class="circle"></div></div>\
<span class="Old-Param-Values">0</span>\
</div>\
<div class="Old-Fixed-Param hunger">\
<img src="' + icons.hunger + '" class="old-param__icon">\
<div class="Old-Param-Progress"><div class="Old-Progress__Values" style="width:100%"><img src="' + icons.circle + '" class="circle"></div></div>\
<span class="Old-Param-Values">100</span>\
</div>\
<div class="Old-Fixed-Param breath">\
<img src="' + icons.breath + '" class="old-param__icon">\
<div class="Old-Param-Progress"><div class="Old-Progress__Values" style="width:100%"><img src="' + icons.circle + '" class="circle"></div></div>\
<span class="Old-Param-Values">100</span>\
</div>\
</div>\
</div>\
<div class="Old-Fixed-Weapon">\
<img src="' + icons.wanted_back + '" class="Old-Fixed-Weapon_back">\
<img src="' + weaponIcons[0] + '" class="Old-Fixed-Weapon_icon">\
<div class="Old-Fixed-Weapon_ammo"><span class="Ammo-in-clip">0</span><span class="Ammo-full"> /0</span></div>\
</div>\
</div>\
<div class="Old-Fixed-Wanted">\
<img src="' + icons.weapon_back + '" class="Old-Fixed-Wanted_back">\
<div class="Wanted_row">\
<img src="' + icons.inactive_wanted + '">\
<img src="' + icons.inactive_wanted + '">\
<img src="' + icons.inactive_wanted + '">\
<img src="' + icons.inactive_wanted + '">\
<img src="' + icons.inactive_wanted + '">\
<img src="' + icons.inactive_wanted + '">\
</div>\
</div>\
</div>\
<div class="Old-Fixed-HudBottom">\
<div class="Old-Fixed-Freeze">\
<span class="Old-Fixed-Freeze_text">Freeze:</span>\
<span class="Old-Fixed-Freeze_value">100</span>\
</div>\
</div>\
</div>\
';
        document.body.appendChild(hudElement);
    }

    // ============ Update Handlers ============
    var updateFunctions = {
        show: function(value) {
            var hudEl = document.querySelector(".Old-Fixed-Hud");
            if (hudEl) hudEl.style.display = +value >= 1 ? "" : "none";
        },
        showBars: function(value) { updateFunctions.show(value); },
        weapon: function(value) {
            var weaponIcon = document.querySelector(".Old-Fixed-Weapon_icon");
            if (weaponIcon && weaponIcons[value]) weaponIcon.src = weaponIcons[value];
            var ammoEls = document.querySelectorAll(".Old-Fixed-Weapon_ammo span");
            ammoEls.forEach(function(el) { if (el) el.style.display = value >= 16 ? "" : "none"; });
        },
        health: function(value) { updateParam("health", value); },
        armour: function(value) { updateParam("armour", value); },
        hunger: function(value) { updateParam("hunger", value); },
        breath: function(value) {
            var breathWrapper = document.querySelector(".Old-Fixed-Param.breath .Old-Param-Progress");
            if (breathWrapper && breathWrapper.parentElement) breathWrapper.parentElement.style.display = value < 99 ? "" : "none";
            updateParam("breath", value);
        },
        bonus: function(bonusValue) {
            var bonusEl = document.querySelector(".Old-Fixed-Bonus");
            if (bonusEl) {
                bonusEl.style.display = bonusValue <= 1 ? "none" : "";
                bonusEl.textContent = "x" + bonusValue;
            }
        },
        server: function(serverId) {
            var serverWrapper = document.querySelector(".Old-Fixed-Logo img");
            if (serverWrapper) {
                if (serverId <= 0) { serverWrapper.style.display = "none"; return; }
                serverWrapper.style.display = "";
                if (logoImages[serverId]) serverWrapper.src = logoImages[serverId];
            }
        },
        money: function(value) {
            var moneyEl = document.querySelector(".Old-Fixed-Cash span");
            if (moneyEl) moneyEl.textContent = formatNumberWithDots(value);
        },
        wanted: function(value) {
            var wantedIcons = document.querySelectorAll(".Wanted_row img");
            wantedIcons.forEach(function(icon, index) {
                icon.src = index < value ? icons.active_wanted : icons.inactive_wanted;
            });
            var wantedWrapper = document.querySelector(".Old-Fixed-Wanted");
            if (wantedWrapper) wantedWrapper.style.display = value > 0 ? "" : "none";
        },
        ammoInClip: function(value) {
            var el = document.querySelector(".Ammo-in-clip");
            if (el) el.textContent = value;
        },
        totalAmmo: function(value) {
            var el = document.querySelector(".Ammo-full");
            if (el) el.textContent = " " + value;
        },
        freeze: function(value) {
            var freezeEl = document.querySelector(".Old-Fixed-Freeze_value");
            if (freezeEl) freezeEl.textContent = String(value).padStart(3, '0');
        }
    };

    function updateParam(paramClass, value) {
        var paramElement = document.querySelector(".Old-Fixed-Param." + paramClass);
        if (paramElement) {
            var progressBar = paramElement.querySelector(".Old-Progress__Values");
            var valueText = paramElement.querySelector(".Old-Param-Values");
            if (progressBar) progressBar.style.width = value + "%";
            if (valueText) valueText.textContent = value;
        }
    }

    // ============ Info Change Handler ============
    function onInfoChange(type, value) {
        setTimeout(function() {
            if (loadingNotification) {
                loadingNotification.style.opacity = '0';
                setTimeout(function() { if (loadingNotification && loadingNotification.parentNode) loadingNotification.remove(); }, 2500);
                loadingNotification = null;
            }
        }, 1000);
        if (updateFunctions[type]) updateFunctions[type](value);
    }

    // ============ Proxy Init ============
    function initializeHudProxy() {
        var attempts = 0;
        var checkInterval = setInterval(function() {
            attempts++;
            if (attempts > 100) { clearInterval(checkInterval); return; }
            if (typeof window.interface === "function" && window.interface("Hud").info) {
                clearInterval(checkInterval);
                var hudInfo = window.interface("Hud").info;
                var clonedHudInfo;
                try { clonedHudInfo = JSON.parse(JSON.stringify(hudInfo)); } catch(e) { return; }

                window.interface("Hud").info = new Proxy(clonedHudInfo, {
                    set: function(target, prop, value) {
                        if (target[prop] !== value) {
                            target[prop] = value;
                            onInfoChange(prop, value);
                        }
                        return Reflect.set(target, prop, value);
                    }
                });

                window.interface("Hud").setServer = function(serverId) {
                    onInfoChange("server", serverId);
                    window.interface("Hud").server = serverId;
                };
                window.interface("Hud").setBonus = function(bonusValue) {
                    onInfoChange("bonus", bonusValue);
                    window.interface("Hud").bonus = bonusValue;
                };
                window.interface("Hud").showGreenZoneTab = function() { onInfoChange("greenZone", true); };
                window.interface("Hud").hideGreenZoneTab = function() { onInfoChange("greenZone", false); };

                createHud();

                var props = ['health', 'armour', 'hunger', 'breath', 'money', 'wanted', 'ammoInClip', 'totalAmmo', 'freeze', 'weapon', 'show'];
                props.forEach(function(prop) {
                    if (prop in hudInfo && updateFunctions[prop]) updateFunctions[prop](hudInfo[prop]);
                });
                if ('server' in window.interface("Hud")) updateFunctions.server(window.interface("Hud").server);
                if ('bonus' in window.interface("Hud")) updateFunctions.bonus(window.interface("Hud").bonus);
            }
        }, 100);
    }

    initializeHudProxy();
    window.onInfoChange = onInfoChange;
}
AddHud();

// ============================================================
// /color — Смена цвета худа (перехват из фыв.js)
// ============================================================
(function() {
    if (window.__sbColorInit) return;
    window.__sbColorInit = true;

    var currentHudColor = '#FF3676';
    var colorStyleNode = null;

    var colorPresets = [
        { name: 'Розовый',    hex: '#FF3676' },
        { name: 'Красный',    hex: '#E53935' },
        { name: 'Оранжевый',  hex: '#FF9800' },
        { name: 'Жёлтый',     hex: '#FFD600' },
        { name: 'Зелёный',    hex: '#4CAF50' },
        { name: 'Бирюзовый',  hex: '#00BCD4' },
        { name: 'Синий',      hex: '#2196F3' },
        { name: 'Индиго',     hex: '#3F51B5' },
        { name: 'Фиолетовый', hex: '#9C27B0' },
        { name: 'Белый',      hex: '#FFFFFF' },
        { name: 'Свой цвет',  hex: 'custom' }
    ];

    function sbNotif(title, text) {
        var notif = document.createElement('div');
        notif.style.cssText = 'position:fixed;bottom:40px;right:55px;background:rgba(0,0,0,0.8);color:white;font-family:GothamPro,sans-serif;font-weight:700;padding:8px 12px;border-radius:6px;font-size:12px;z-index:9999;opacity:0;transform:translateX(20px);transition:opacity .3s ease,transform .3s ease;pointer-events:none;';
        notif.innerHTML = '<b>' + title + '</b><br>' + text;
        document.body.appendChild(notif);
        setTimeout(function() { notif.style.opacity = '1'; notif.style.transform = 'translateX(0)'; }, 10);
        setTimeout(function() {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(20px)';
            setTimeout(function() { notif.remove(); }, 300);
        }, 3000);
    }

    function applyHudColor(color) {
        currentHudColor = color;
        if (colorStyleNode) colorStyleNode.remove();
        var style = document.createElement('style');
        style.id = 'sb-color-override';
        style.textContent = '#app .hud-radmir-radar__map{border:0.60vh solid ' + color + ' !important}';
        document.head.appendChild(style);
        colorStyleNode = style;
    }

    function openColorMenu() {
        var list = colorPresets.map(function(p) { return p.name; }).join('<n>');
        window.addDialogInQueue(
            '[0,2,"Настройка цвета худа","Выберите цвет:","Выбрать","Закрыть",0,0]',
            list, 0
        );
        var orig = window.sendClientEvent;
        window.sendClientEvent = function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.includes("OnDialogResponse")) {
                var raw = (args[5] || "").toLowerCase();
                for (var i = 0; i < colorPresets.length; i++) {
                    if (raw.includes(colorPresets[i].name.toLowerCase())) {
                        if (colorPresets[i].hex === 'custom') {
                            setTimeout(openCustomColorMenu, 100);
                        } else {
                            applyHudColor(colorPresets[i].hex);
                            sbNotif("Цвет худа", "Установлен: " + colorPresets[i].name);
                            try { localStorage.setItem('sb_hud_color', colorPresets[i].hex); } catch(e) {}
                        }
                        break;
                    }
                }
                window.sendClientEvent = orig;
            }
            return orig.apply(this, args);
        };
    }

    function openCustomColorMenu() {
        window.addDialogInQueue(
            '[0,1,"Свой цвет","Введите HEX (#FF0000):","Ок","Назад",0,0]',
            "", 0
        );
        var orig = window.sendClientEvent;
        window.sendClientEvent = function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.includes("OnDialogResponse")) {
                var input = (args[5] || "").trim().toLowerCase().replace("#", "");
                if (/^[0-9a-f]{3}$/.test(input)) input = input.split("").map(function(c){return c+c}).join("");
                if (/^[0-9a-f]{6}$/.test(input)) {
                    applyHudColor('#' + input);
                    sbNotif("Цвет худа", "Установлен: #" + input);
                    try { localStorage.setItem('sb_hud_color', '#' + input); } catch(e) {}
                } else {
                    sbNotif("Ошибка", "Неверный формат цвета");
                }
                window.sendClientEvent = orig;
            }
            return orig.apply(this, args);
        };
    }

    // Перехват /color
    var waitInterval = setInterval(function() {
        if (!window.sendChatInput) return;
        clearInterval(waitInterval);
        var orig = window.sendChatInput;
        window.sendChatInput = function() {
            var a = Array.prototype.slice.call(arguments);
            var msg = a.join("").trim();
            if (msg === "/color" || msg === "/цвет") { openColorMenu(); return; }
            return orig.apply(this, a);
        };
    }, 500);

    // Восстановление цвета
    try {
        var saved = localStorage.getItem('sb_hud_color');
        if (saved && /^#[0-9a-f]{6}$/i.test(saved)) applyHudColor(saved);
    } catch(e) {}

    window.sbHud.setColor = applyHudColor;
    window.sbHud.getColor = function() { return currentHudColor; };
})();
