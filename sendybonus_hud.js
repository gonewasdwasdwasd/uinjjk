function AddHud() {
    var hudStyleElement;
    var loadingNotification;

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

    var accentColor = '#FF3676';
    var icons = {
        health: '', armour: '', hunger: '', breath: '', cash: '',
        wanted_active: '', wanted_inactive: '', weapon_back: '', zone: '', circle: ''
    };
    var weaponIcons = {};
    for (var i = 0; i <= 46; i++) weaponIcons[i] = '';
    var logoImages = {};
    for (var i = 1; i <= 21; i++) logoImages[i] = '';

    function createHud() {
        hudStyleElement = document.createElement("style");
        hudStyleElement.id = "sbHudStyles";
        var css = '';
        // Шрифты
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Black/GothamPro-Black.ttf) format("truetype");font-weight:900;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Bold/GothamPro-Bold.ttf) format("truetype");font-weight:700;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Medium/GothamPro-Medium.ttf) format("truetype");font-weight:500;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Regular/GothamPro.ttf) format("truetype");font-weight:400;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Light/GothamPro-Light.ttf) format("truetype");font-weight:300;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-LightItalic/GothamPro-LightItalic.ttf) format("truetype");font-weight:300;font-style:italic}\n';
        // Скрытие дефолтных элементов
        css += '#app .hud-radmir-wanted{display:none}\n';
        css += 'body #app .hud-radmir-info{display:none}\n';
        css += '.hud-hassle-map .map-mask{display:none}\n';
        css += '#app .hud-radmir-radar__radar-border{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-border_new-year{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-border_helloween{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-bats{display:none !important}\n';
        // Квадратный радар — тонкая обводка, без скруглений
        css += '#app .hud-radmir-radar__map{width:22vh !important;height:22vh !important;overflow:hidden;display:flex;justify-content:center;align-items:center;border-radius:0 !important;border:0.25vh solid ' + accentColor + ' !important}\n';
        css += 'body #app .hud-radmir-radar__map{transition:.3s}\n';
        css += '#app .hud-hassle-map{width:32vh !important;height:32vh !important}\n';
        css += '#app .hud-radmir-radar__radar{width:26.3vh}\n';
        css += '#app .hud-radmir-radar{left:7.8vh;bottom:4.03vh}\n';
        // Авторизация
        css += 'body .authorization{background:0 0 !important}\n';
        css += '#app .authorization{background-image:none !important}\n';
        // Модалки
        css += '#app .modal-container-wrapper{background:rgba(0,0,0,0.8) !important;border:0.19vh solid #ffffff0d;border-radius:2.5vh !important}\n';
        css += '#app .modal-light__light,#app .modal-light__light_second,#app .modal-overlay{background:none !important}\n';
        // Чат
        css += '#app .radmir-chat-input__input{background:rgba(0,0,0,0.8) !important;border-radius:11px !important;border:1px solid rgba(255,255,255,0.08) !important}\n';
        css += '#app .radmir-chat-input__input input{margin-left:.9vh !important;color:#fff !important}\n';
        // Инвентарь
        css += '#app .inventory{background:none}\n';
        css += '#app .inventory-container__info__container{background:rgba(0,0,0,0.8) !important;border-radius:1.1vh}\n';
        css += '#app .inventory-extra__container,#app .inventory-main{background:rgba(0,0,0,0.8);border-radius:1.1vh;padding:2vh}\n';
        css += '#app .inventory-main__after,#app .inventory-main__before{display:none}\n';
        // Трейд
        css += '#app .trade-items{background:none}\n';
        css += '#app .trade-items__container{border-radius:10px;background:rgba(0,0,0,0.8) !important}\n';
        // Топливо
        css += '#app .fuel__container{background:rgba(0,0,0,0.8);padding:3.33vh 2.96vh}\n';
        css += '#app .fuel__button{background:linear-gradient(185.93deg,#fff -22.13%,#e6e6e6 122.51%) !important;color:rgba(0,0,0,0.8) !important}\n';
        // Смерть
        css += '#app .death{font-style:italic;background:rgba(0,0,0,0.74) !important}\n';
        // Радиальное
        css += '#app .player-interaction__container{background:rgba(0,0,0,0.8);border:none}\n';
        css += '#app .player-interaction__title,.player-interaction__title_active{color:#fff !important}\n';
        css += '#app .player-interaction__icon{fill:white}\n';
        hudStyleElement.innerHTML = css;
        document.head.appendChild(hudStyleElement);

        var hud = document.createElement("div");
        hud.id = 'sbHudContainer';
        hud.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;font-family:GothamPro,sans-serif';

        // ====== ЛОГО (верхний правый угол, однострочное) ======
        var logo = document.createElement('div');
        logo.style.cssText = 'position:absolute;top:20px;right:20px;text-align:right';
        logo.innerHTML = '' +
            '<div style="display:flex;align-items:center;justify-content:flex-end;gap:10px">' +
            '<img id="sbLogoImg" src="' + logoImages[1] + '" style="width:28vh;height:9vh;object-fit:contain">' +
            '<div style="display:flex;flex-direction:column;align-items:flex-end">' +
            '<div style="font-family:GothamPro;font-weight:700;font-size:1.6vh;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.25)"><span id="sbServerName">SendyBonus</span> <span style="color:' + accentColor + ';font-weight:900">x3</span></div>' +
            '<div style="font-family:GothamPro;font-weight:500;font-size:1.2vh;color:#7B93D1;margin-top:0.3vh"><span id="sbOnlineCount">0</span> Online</div>' +
            '<div style="font-family:GothamPro;font-weight:400;font-size:1.2vh;color:rgba(255,255,255,0.5);margin-top:0.2vh"><span id="sbPlayerId">[0]</span></div>' +
            '</div>' +
            '</div>';
        hud.appendChild(logo);

        // ====== ДЕНЬГИ (под логотипом, из примера жс кода) ======
        var cash = document.createElement('div');
        cash.style.cssText = 'position:absolute;top:12vh;right:20px;text-align:right';
        cash.innerHTML = '<div style="display:flex;align-items:center;justify-content:flex-end;color:white;font-family:GothamPro;font-weight:900;font-style:italic;font-size:2.59vh;text-shadow:0 0 .46vh #000000cb"><img src="' + icons.cash + '" style="margin-right:13px;margin-top:1px"><span id="sbCashVal">0</span></div>';
        hud.appendChild(cash);

        // ====== СТАТУС БАРЫ (под деньгами) ======
        var bars = document.createElement('div');
        bars.style.cssText = 'position:absolute;top:16vh;right:2.6vw;display:flex;flex-direction:column;gap:0.6vh';
        bars.innerHTML = '' +
            '<div class="sb-bar" style="display:flex;align-items:center;gap:0.7vh">' +
            '<img src="' + icons.health + '" style="width:1.4vh;height:1.2vh;position:relative;margin-top:-0.2vh">' +
            '<div style="width:9.4vh;height:0.46vh;background:#0000004d;border-radius:0.46vh"><div class="sb-fill" data-p="health" style="width:100%;height:100%;background:#ed2e2e;border-radius:0.46vh;transition:width .3s"></div></div>' +
            '<span class="sb-pv" data-p="health" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>' +
            '<div class="sb-bar" style="display:flex;align-items:center;gap:0.7vh">' +
            '<img src="' + icons.armour + '" style="width:1.4vh;height:1.4vh;position:relative;margin-top:-0.2vh">' +
            '<div style="width:9.4vh;height:0.46vh;background:#0000004d;border-radius:0.46vh"><div class="sb-fill" data-p="armour" style="width:0%;height:100%;background:#526ee6;border-radius:0.46vh;transition:width .3s"></div></div>' +
            '<span class="sb-pv" data-p="armour" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">0</span>' +
            '</div>' +
            '<div class="sb-bar" style="display:flex;align-items:center;gap:0.7vh">' +
            '<img src="' + icons.hunger + '" style="width:0.9vh;height:1.1vh;position:relative;margin-top:-0.2vh">' +
            '<div style="width:9.4vh;height:0.46vh;background:#0000004d;border-radius:0.46vh"><div class="sb-fill" data-p="hunger" style="width:100%;height:100%;background:#ff872e;border-radius:0.46vh;transition:width .3s"></div></div>' +
            '<span class="sb-pv" data-p="hunger" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>' +
            '<div class="sb-bar" id="sbBreathBar" style="display:none;align-items:center;gap:0.7vh">' +
            '<img src="' + icons.breath + '" style="width:1.7vh;height:1.7vh;position:relative;margin-top:-0.2vh">' +
            '<div style="width:9.4vh;height:0.46vh;background:#0000004d;border-radius:0.46vh"><div class="sb-fill" data-p="breath" style="width:100%;height:100%;background:#4fc3f7;border-radius:0.46vh;transition:width .3s"></div></div>' +
            '<span class="sb-pv" data-p="breath" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>';
        hud.appendChild(bars);

        // ====== ОРУЖИЕ + WANTED + AMMO ======
        var weaponWrap = document.createElement('div');
        weaponWrap.id = 'sbWeaponWrap';
        weaponWrap.style.cssText = 'position:absolute;top:25vh;right:2vw;width:16.6vh;height:16.6vh;display:none';
        weaponWrap.innerHTML = '' +
            '<img id="sbWeaponBack" src="' + icons.wanted_back + '" style="position:absolute;right:-1.4vh;top:-1.6vh;z-index:-1">' +
            '<img id="sbWeaponIcon" src="" style="width:40vh;height:17.6vh">' +
            '<div style="position:absolute;bottom:5.6vh;right:6vh;display:flex;align-items:flex-end;color:#fff;gap:3.4vh">' +
            '<span style="font-family:GothamPro;font-weight:700;font-style:italic;font-size:2.31vh;line-height:1;text-shadow:0 0 .46vh #00000080" id="sbAmmoInClip">0</span>' +
            '<span style="font-family:GothamPro;font-weight:300;font-style:italic;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3" id="sbAmmoTotal"> /0</span>' +
            '</div>';
        hud.appendChild(weaponWrap);

        // ====== WANTED (5 звёзд, под логотипом) ======
        var wantedWrap = document.createElement('div');
        wantedWrap.id = 'sbWantedWrap';
        wantedWrap.style.cssText = 'position:absolute;top:13.5vh;right:20px;display:none;align-items:center;gap:0.3vh;flex-direction:row-reverse';
        hud.appendChild(wantedWrap);

        // ====== СПИДОМЕТР (над временем, снизу справа) ======
        var speedPanel = document.createElement('div');
        speedPanel.id = 'sbSpeedPanel';
        speedPanel.style.cssText = 'position:absolute;bottom:68px;right:20px;display:none;align-items:center;padding:10px 22px 10px 30px;background:rgba(7,16,48,0.62);border-radius:41px 9px 9px 40px;gap:12px';
        speedPanel.innerHTML = '' +
            '<div style="display:flex;align-items:baseline;gap:4px">' +
            '<span style="font-family:GothamPro;font-weight:700;font-size:22px;color:#fff" id="sbSpeed">0</span>' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:11px;color:rgba(255,255,255,0.5)">км/ч</span>' +
            '</div>' +
            '<div style="width:1px;height:24px;background:rgba(255,255,255,0.1)"></div>' +
            '<div style="display:flex;flex-direction:column;align-items:center">' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:13px;color:#8BA2F0" id="sbFuel">0 L</span>' +
            '</div>';
        hud.appendChild(speedPanel);

        // ====== ИНФО ПАНЕЛЬ (снизу справа — время и дата) ======
        var infoPanel = document.createElement('div');
        infoPanel.style.cssText = 'position:absolute;bottom:20px;right:20px;display:flex;align-items:center;padding:14px 22px 14px 30px;background:rgba(7,16,48,0.62);border-radius:41px 9px 9px 40px';
        infoPanel.innerHTML = '' +
            '<svg width="24" height="24" viewBox="0 0 18 18" style="margin-right:8.5px;flex-shrink:0"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5ZM8.99999 3C5.68628 3 2.99999 5.6863 2.99999 9C2.99999 12.3137 5.68628 15 8.99999 15C12.3137 15 15 12.3137 15 9C15 5.6863 12.3137 3 8.99999 3ZM9 4.5C9.38463 4.5 9.70163 4.78953 9.74495 5.16253L9.75 5.25V8.68934L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.76 11.3007 10.3345 11.3215 10.0403 11.0927L9.96967 11.0303L8.46967 9.53033C8.35246 9.41312 8.27805 9.2611 8.2565 9.09858L8.25 9V5.25C8.25 4.83578 8.58579 4.5 9 4.5Z" fill="white"/></svg>' +
            '<div style="display:flex;flex-direction:column">' +
            '<div style="display:flex;align-items:center;gap:12px">' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:15px;color:#fff" id="sbTime">--:--</span>' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:15px;color:#7B93D1" id="sbDate">--.--.----</span>' +
            '</div>' +
            '</div>';
        hud.appendChild(infoPanel);

        // ====== ПОДСКАЗКИ (справа от радара) ======
        var help = document.createElement('div');
        help.id = 'sbHelpPanel';
        help.style.cssText = 'position:absolute;bottom:4vh;left:calc(7.8vh + 22vh + 2vh);display:flex;flex-direction:column;gap:0.4vh;font-family:GothamPro;font-size:1.4vh;color:#fff;text-shadow:1px 1px 4px #000';
        help.innerHTML = '' +
            '<div style="display:flex;align-items:center;gap:0.5vh"><span style="min-width:2vh;padding:0.2vh 0.4vh;background:rgba(0,0,0,0.4);border-radius:0.5vh;text-align:center">M</span> Меню</div>' +
            '<div style="display:flex;align-items:center;gap:0.5vh"><span style="min-width:2vh;padding:0.2vh 0.4vh;background:rgba(0,0,0,0.4);border-radius:0.5vh;text-align:center">I</span> Инвентарь</div>' +
            '<div style="display:flex;align-items:center;gap:0.5vh"><span style="min-width:2vh;padding:0.2vh 0.4vh;background:rgba(0,0,0,0.4);border-radius:0.5vh;text-align:center">X</span> Голос</div>' +
            '<div style="display:flex;align-items:center;gap:0.5vh"><span style="min-width:2vh;padding:0.2vh 0.4vh;background:rgba(0,0,0,0.4);border-radius:0.5vh;text-align:center">Z</span> Анимации</div>' +
            '<div style="display:flex;align-items:center;gap:0.5vh"><span style="min-width:2vh;padding:0.2vh 0.4vh;background:rgba(0,0,0,0.4);border-radius:0.5vh;text-align:center">F1</span> Помощь</div>';
        hud.appendChild(help);

        // ====== FREEZE ======
        var freeze = document.createElement('div');
        freeze.style.cssText = 'position:absolute;background:hsl(190deg 63% 66% / 40%);width:26.11vh;height:0.65vh;border-radius:1vh;outline:hsl(0deg 0% 0% / 20%) 0.2vh solid;outline-offset:0.1vh;overflow:hidden;left:11.16vh;bottom:2.78vh';
        freeze.innerHTML = '<span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:2vh;text-shadow:0 0 2vh #000;margin-right:1vh">Freeze:</span><span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:2vh;text-shadow:0 0 2vh #000" id="sbFreezeVal">100</span>';
        hud.appendChild(freeze);

        document.body.appendChild(hud);

        // Wanted stars (5 штук как в GTA)
        var wr = document.getElementById('sbWantedWrap');
        for (var w = 0; w < 5; w++) {
            var star = document.createElement('img');
            star.src = icons.inactive_wanted;
            star.className = 'sb-wanted-star';
            star.style.cssText = 'width:2.5vh;height:2vh;padding:0.15vh;transition:opacity .2s';
            wr.appendChild(star);
        }
    }

    // ============ Update Handlers ============
    var updateFunctions = {
        show: function(v) { var el = document.getElementById('sbHudContainer'); if (el) el.style.display = +v >= 1 ? '' : 'none'; },
        showBars: function(v) { updateFunctions.show(v); },
        health: function(v) { updateBar('health', v); },
        armour: function(v) { updateBar('armour', v); },
        hunger: function(v) { updateBar('hunger', v); },
        breath: function(v) {
            var b = document.getElementById('sbBreathBar');
            if (b) b.style.display = v < 99 ? 'flex' : 'none';
            updateBar('breath', v);
        },
        money: function(v) {
            var el = document.getElementById('sbCashVal');
            if (el) el.textContent = formatNumberWithDots(v);
        },
        weapon: function(v) {
            var icon = document.getElementById('sbWeaponIcon');
            var wrap = document.getElementById('sbWeaponWrap');
            if (icon && weaponIcons[v]) icon.src = weaponIcons[v];
            if (wrap) wrap.style.display = v >= 1 ? '' : 'none';
        },
        ammoInClip: function(v) { var el = document.getElementById('sbAmmoInClip'); if (el) el.textContent = v; },
        totalAmmo: function(v) { var el = document.getElementById('sbAmmoTotal'); if (el) el.textContent = ' ' + v; },
        wanted: function(v) {
            var stars = document.querySelectorAll('.sb-wanted-star');
            var level = Math.min(v, 5);
            stars.forEach(function(s, i) {
                if (i < level) {
                    s.src = icons.active_wanted;
                    s.style.opacity = '1';
                } else {
                    s.src = icons.inactive_wanted;
                    s.style.opacity = '0.3';
                }
            });
            var wrap = document.getElementById('sbWantedWrap');
            if (wrap) wrap.style.display = level > 0 ? 'flex' : 'none';
        },
        server: function(id) {
            var img = document.getElementById('sbLogoImg');
            if (img) { if (id <= 0) { img.style.display = 'none'; return; } img.style.display = ''; if (logoImages[id]) img.src = logoImages[id]; }
        },
        bonus: function(v) {
            // x3 теперь в логотипе как текст — обновлять не нужно
        },
        freeze: function(v) { var el = document.getElementById('sbFreezeVal'); if (el) el.textContent = String(v).padStart(3, '0'); },
        time: function(v) { var el = document.getElementById('sbTime'); if (el) el.textContent = v; },
        date: function(v) { var el = document.getElementById('sbDate'); if (el) el.textContent = v; },
        street: function(v) {},
        crossingRoad: function(v) {},
        online: function(v) { var el = document.getElementById('sbOnlineCount'); if (el) el.textContent = v; },
        playerId: function(v) { var el = document.getElementById('sbPlayerId'); if (el) el.textContent = '[' + v + ']'; },
        ammo: function(v) {},
        greenZone: function(v) {},
        speed: function(v) {
            var el = document.getElementById('sbSpeed');
            var panel = document.getElementById('sbSpeedPanel');
            if (el) el.textContent = v;
            if (panel) panel.style.display = 'flex';
        },
        fuel: function(v) {
            var el = document.getElementById('sbFuel');
            if (el) el.textContent = v + ' L';
        },
        inVeh: function(v) {
            var panel = document.getElementById('sbSpeedPanel');
            if (panel) panel.style.display = v ? 'flex' : 'none';
        }
    };

    function updateBar(param, value) {
        var fill = document.querySelector('.sb-fill[data-p="' + param + '"]');
        var val = document.querySelector('.sb-pv[data-p="' + param + '"]');
        if (fill) fill.style.width = value + '%';
        if (val) val.textContent = value;
    }

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

    function initializeHudProxy() {
        var attempts = 0;
        var checkInterval = setInterval(function() {
            attempts++;
            if (attempts > 100) { clearInterval(checkInterval); return; }
            if (typeof window.interface === "function" && window.interface("Hud") && window.interface("Hud").info) {
                clearInterval(checkInterval);
                var hudInfo = window.interface("Hud").info;
                var cloned;
                try { cloned = JSON.parse(JSON.stringify(hudInfo)); } catch(e) { return; }
                window.interface("Hud").info = new Proxy(cloned, {
                    set: function(target, prop, value) {
                        if (target[prop] !== value) { target[prop] = value; onInfoChange(prop, value); }
                        return Reflect.set(target, prop, value);
                    }
                });
                window.interface("Hud").setServer = function(id) { onInfoChange("server", id); window.interface("Hud").server = id; };
                window.interface("Hud").setBonus = function(v) { onInfoChange("bonus", v); window.interface("Hud").bonus = v; };
                window.interface("Hud").showGreenZoneTab = function() { onInfoChange("greenZone", true); };
                window.interface("Hud").hideGreenZoneTab = function() { onInfoChange("greenZone", false); };
                createHud();
                var props = ['health','armour','hunger','breath','money','wanted','ammoInClip','totalAmmo','freeze','weapon','show','time','date','street','crossingRoad','online','playerId','ammo'];
                props.forEach(function(p) { if (p in hudInfo && updateFunctions[p]) updateFunctions[p](hudInfo[p]); });
                if ('server' in window.interface("Hud")) updateFunctions.server(window.interface("Hud").server);
            }
        }, 100);
    }

    initializeHudProxy();
    window.onInfoChange = onInfoChange;
}
AddHud();

// ============================================================
// /color — Перекраска ВСЕГО худа
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
        var n = document.createElement('div');
        n.style.cssText = 'position:fixed;bottom:40px;right:55px;background:rgba(0,0,0,0.8);color:white;font-family:GothamPro,sans-serif;font-weight:700;padding:8px 12px;border-radius:6px;font-size:12px;z-index:9999;opacity:0;transform:translateX(20px);transition:opacity .3s,transform .3s;pointer-events:none';
        n.innerHTML = '<b>' + title + '</b><br>' + text;
        document.body.appendChild(n);
        setTimeout(function() { n.style.opacity = '1'; n.style.transform = 'translateX(0)'; }, 10);
        setTimeout(function() { n.style.opacity = '0'; n.style.transform = 'translateX(20px)'; setTimeout(function() { n.remove(); }, 300); }, 3000);
    }

    function applyHudColor(color) {
        currentHudColor = color;
        if (colorStyleNode) colorStyleNode.remove();
        var s = document.createElement('style');
        s.id = 'sb-color-override';
        var css = '';
        // Радар обводка
        css += '#app .hud-radmir-radar__map{border-color:' + color + ' !important}\n';
        // x3 текст в логотипе
        css += '#sbHudContainer [style*="font-weight:900"]{color:' + color + ' !important}\n';
        // Info panel accent
        css += '#sbHudContainer #sbDate{color:' + color + ' !important}\n';
        s.textContent = css;
        document.head.appendChild(s);
        colorStyleNode = s;
    }

    function openColorMenu() {
        var list = colorPresets.map(function(p) { return p.name; }).join('<n>');
        window.addDialogInQueue('[0,2,"Цвет худа","Выберите:","Выбрать","Закрыть",0,0]', list, 0);
        var orig = window.sendClientEvent;
        window.sendClientEvent = function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.includes("OnDialogResponse")) {
                var raw = (args[5] || "").toLowerCase();
                for (var i = 0; i < colorPresets.length; i++) {
                    if (raw.includes(colorPresets[i].name.toLowerCase())) {
                        if (colorPresets[i].hex === 'custom') { setTimeout(openCustomColorMenu, 100); }
                        else { applyHudColor(colorPresets[i].hex); sbNotif("Цвет", colorPresets[i].name); try { localStorage.setItem('sb_hud_color', colorPresets[i].hex); } catch(e) {} }
                        break;
                    }
                }
                window.sendClientEvent = orig;
            }
            return orig.apply(this, args);
        };
    }

    function openCustomColorMenu() {
        window.addDialogInQueue('[0,1,"Свой цвет","Введите HEX (#FF0000):","Ок","Назад",0,0]', "", 0);
        var orig = window.sendClientEvent;
        window.sendClientEvent = function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.includes("OnDialogResponse")) {
                var input = (args[5] || "").trim().toLowerCase().replace("#", "");
                if (/^[0-9a-f]{3}$/.test(input)) input = input.split("").map(function(c){return c+c}).join("");
                if (/^[0-9a-f]{6}$/.test(input)) { applyHudColor('#' + input); sbNotif("Цвет", '#' + input); try { localStorage.setItem('sb_hud_color', '#' + input); } catch(e) {} }
                else sbNotif("Ошибка", "Неверный формат");
                window.sendClientEvent = orig;
            }
            return orig.apply(this, args);
        };
    }

    var colorInterval = setInterval(function() {
        if (!window.sendChatInput) return;
        clearInterval(colorInterval);
        var orig = window.sendChatInput;
        window.sendChatInput = function() {
            var a = Array.prototype.slice.call(arguments);
            if (a.join("").trim() === "/color" || a.join("").trim() === "/цвет") { openColorMenu(); return; }
            return orig.apply(this, a);
        };
    }, 500);

    try { var saved = localStorage.getItem('sb_hud_color'); if (saved) applyHudColor(saved); } catch(e) {}
    window.sbHud.setColor = applyHudColor;
    window.sbHud.getColor = function() { return currentHudColor; };
})();
