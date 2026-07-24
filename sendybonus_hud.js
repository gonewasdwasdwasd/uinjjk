function AddHud() {
    var hudStyleElement;
    var loadingNotification;

    function showLoadingNotification() {
        if (document.getElementById('loadingNotification')) return;
        loadingNotification = document.createElement('div');
        loadingNotification.id = 'loadingNotification';
        loadingNotification.style.cssText = 'position:fixed;bottom:10%;left:50%;transform:translateX(-50%);display:flex;align-items:center;padding:10px 20px;background:rgba(0,0,0,0.8);color:#fff;font-family:GothamPro,sans-serif;font-size:16px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.3);opacity:0;transition:opacity 2.5s;z-index:1000;';
        var sp = document.createElement('div');
        sp.style.cssText = 'width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top:3px solid #fff;border-radius:50%;margin-right:10px;animation:sbSpin 1s linear infinite;';
        var tx = document.createElement('span');
        tx.textContent = 'SendyBonus';
        loadingNotification.appendChild(sp);
        loadingNotification.appendChild(tx);
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

    var iconBase = 'C:\\Users\\1337\\Desktop\\awr\\legacy bd\\иконки\\';
    var weaponBase = 'C:\\Users\\1337\\Desktop\\awr\\legacy bd\\оружия\\';

    var icons = {
        health: iconBase + 'health.png',
        armour: iconBase + 'armour.png',
        hunger: iconBase + 'hunger.png',
        breath: iconBase + 'breath.png',
        cash: iconBase + 'cash.png',
        active_wanted: iconBase + 'active_wanted.png',
        circle: iconBase + 'circle.png'
    };

    var weaponIcons = {};
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46].forEach(function(id) {
        weaponIcons[id] = weaponBase + id + '.png';
    });

    // Логотипы серверов (пустые — замени на свои URL)
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
        // Скрытие дефолтных элементов РАДАРА (не трогаем сам радар!)
        css += '#app .hud-radmir-wanted{display:none}\n';
        css += 'body #app .hud-radmir-info{display:none}\n';
        css += '.hud-hassle-map .map-mask{display:none}\n';
        css += '#app .hud-radmir-radar__radar-border{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-border_new-year{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-border_helloween{display:none !important}\n';
        css += '#app .hud-radmir-radar__radar-bats{display:none !important}\n';
        // Радар — квадратный, тонкая обводка, левее
        css += '#app .hud-radmir-radar__map{border-radius:0 !important;border:0.2vh solid #FFD600 !important}\n';
        css += '#app .hud-radmir-radar{left:5vh !important;bottom:4vh !important}\n';
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

        // ====== ЛОГО (текстовое, SENDY белое + BONUS жёлтое) ======
        var logo = document.createElement('div');
        logo.style.cssText = 'position:absolute;top:15px;right:20px;text-align:right';
        logo.innerHTML = '' +
            '<div style="font-family:GothamPro;font-weight:900;font-size:3.2vh;line-height:1;text-shadow:0 2px 8px rgba(0,0,0,0.5)">' +
            '<span style="color:#fff">SENDY</span><span style="color:#FFD600">BONUS</span>' +
            '</div>' +
            '<img id="sbLogoImg" style="width:32vh;height:10vh;object-fit:contain;display:block;margin-top:0.5vh">';
        hud.appendChild(logo);

        // ====== ДЕНЬГИ (под логотипом) ======
        var cashEl = document.createElement('div');
        cashEl.style.cssText = 'position:absolute;top:14vh;right:20px;text-align:right;display:flex;align-items:center;justify-content:flex-end;color:white;font-family:GothamPro;font-weight:900;font-style:italic;font-size:2.59vh;text-shadow:0 0 .46vh #000000cb';
        cashEl.innerHTML = '<span style="display:inline-flex;align-items:center;justify-content:center;width:2.8vh;height:2.8vh;background:#FFD600;border-radius:0.4vh;font-size:1.8vh;font-style:normal;font-weight:900;color:#000;margin-right:0.8vh">Р</span><span id="sbCashVal">0</span>';
        hud.appendChild(cashEl);

        // ====== СТАТУС БАРЫ (под деньгами, без скруглений) ======
        var bars = document.createElement('div');
        bars.style.cssText = 'position:absolute;top:17.5vh;right:2.4vw;display:flex;flex-direction:column;gap:0.5vh';
        bars.innerHTML = '' +
            '<div style="display:flex;align-items:center;gap:0.6vh"><img src="' + icons.health + '" style="width:1.4vh;height:1.2vh"><div style="width:9.4vh;height:0.4vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="health" style="width:100%;height:100%;background:#ed2e2e;transition:width .3s"></div></div><span class="sb-pv" data-p="health" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3vh;font-size:1.5vh">100</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh"><img src="' + icons.armour + '" style="width:1.4vh;height:1.4vh"><div style="width:9.4vh;height:0.4vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="armour" style="width:0%;height:100%;background:#526ee6;transition:width .3s"></div></div><span class="sb-pv" data-p="armour" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3vh;font-size:1.5vh">0</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh"><img src="' + icons.hunger + '" style="width:0.9vh;height:1.1vh"><div style="width:9.4vh;height:0.4vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="hunger" style="width:100%;height:100%;background:#ff872e;transition:width .3s"></div></div><span class="sb-pv" data-p="hunger" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3vh;font-size:1.5vh">100</span></div>' +
            '<div class="sb-breath" style="display:none;align-items:center;gap:0.6vh"><img src="' + icons.breath + '" style="width:1.7vh;height:1.7vh"><div style="width:9.4vh;height:0.4vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="breath" style="width:100%;height:100%;background:#4fc3f7;transition:width .3s"></div></div><span class="sb-pv" data-p="breath" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;width:3vh;font-size:1.5vh">100</span></div>';
        hud.appendChild(bars);

        // ====== WANTED (6 звёзд, под барами) ======
        var wantedWrap = document.createElement('div');
        wantedWrap.id = 'sbWantedWrap';
        wantedWrap.style.cssText = 'position:absolute;top:25vh;right:20px;display:none;align-items:center;gap:0.2vh';
        hud.appendChild(wantedWrap);

        // ====== СПИДОМЕТР (над временем) ======
        var speedPanel = document.createElement('div');
        speedPanel.id = 'sbSpeedPanel';
        speedPanel.style.cssText = 'position:absolute;bottom:65px;right:20px;display:none;align-items:center;padding:10px 20px;background:rgba(7,16,48,0.62);border-radius:9px;gap:10px';
        speedPanel.innerHTML = '' +
            '<div style="display:flex;align-items:baseline;gap:4px"><span style="font-family:GothamPro;font-weight:700;font-size:20px;color:#fff" id="sbSpeed">0</span><span style="font-family:GothamPro;font-weight:500;font-size:10px;color:rgba(255,255,255,0.5)">км/ч</span></div>' +
            '<div style="width:1px;height:20px;background:rgba(255,255,255,0.1)"></div>' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:12px;color:#8BA2F0" id="sbFuel">0 L</span>';
        hud.appendChild(speedPanel);

        // ====== ОРУЖИЕ (над спидометром) ======
        var weaponWrap = document.createElement('div');
        weaponWrap.id = 'sbWeaponWrap';
        weaponWrap.style.cssText = 'position:absolute;bottom:105px;right:20px;display:none;align-items:center;gap:8px;padding:6px 14px;background:rgba(7,16,48,0.62);border-radius:9px';
        weaponWrap.innerHTML = '' +
            '<img id="sbWeaponIcon" src="" style="width:5vh;height:2.5vh;object-fit:contain">' +
            '<div style="display:flex;align-items:baseline;gap:2px">' +
            '<span style="font-family:GothamPro;font-weight:700;font-style:italic;font-size:1.3vh;color:#fff" id="sbAmmoInClip">0</span>' +
            '<span style="font-family:GothamPro;font-weight:300;font-style:italic;font-size:0.9vh;color:rgba(255,255,255,0.5)" id="sbAmmoTotal">/0</span>' +
            '</div>';
        hud.appendChild(weaponWrap);

        // ====== ВРЕМЯ + ДАТА (снизу справа) ======
        var timePanel = document.createElement('div');
        timePanel.style.cssText = 'position:absolute;bottom:20px;right:20px;display:flex;align-items:center;padding:12px 20px;background:rgba(7,16,48,0.62);border-radius:9px;gap:10px';
        timePanel.innerHTML = '' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:14px;color:#fff" id="sbTime">--:--</span>' +
            '<span style="font-family:GothamPro;font-weight:500;font-size:14px;color:#7B93D1" id="sbDate">--.--</span>';
        hud.appendChild(timePanel);

        // ====== ТАБЛИЧКИ ID + ONLINE (справа от радара) ======
        var cards = document.createElement('div');
        cards.style.cssText = 'position:absolute;bottom:4vh;left:calc(5vh + 22vh + 1.5vh);display:flex;flex-direction:column;gap:0.4vh';
        cards.innerHTML = '' +
            '<div style="display:flex;align-items:center;gap:0.4vh;padding:0.3vh 0.7vh;background:rgba(0,0,0,0.4);border-radius:0.4vh;font-family:GothamPro;font-size:1.3vh;color:#fff">' +
            '<span style="color:#FFD600;font-weight:700">ID</span>' +
            '<span style="font-weight:500" id="sbPlayerId">0</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:0.4vh;padding:0.3vh 0.7vh;background:rgba(0,0,0,0.4);border-radius:0.4vh;font-family:GothamPro;font-size:1.3vh;color:#fff">' +
            '<svg width="1.2vh" height="1.2vh" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' +
            '<span id="sbOnlineCount" style="font-weight:500">0</span>' +
            '</div>';
        hud.appendChild(cards);

        // ====== ПОДСКАЗКИ (под табличками) ======
        var help = document.createElement('div');
        help.style.cssText = 'position:absolute;bottom:1.2vh;left:calc(5vh + 22vh + 1.5vh);display:flex;flex-direction:column;gap:0.3vh;font-family:GothamPro;font-size:1.1vh;color:rgba(255,255,255,0.6);text-shadow:1px 1px 3px #000';
        help.innerHTML = '' +
            '<div style="display:flex;align-items:center;gap:0.4vh"><span style="padding:0.15vh 0.3vh;background:rgba(0,0,0,0.4);border-radius:0.3vh">M</span> Меню</div>' +
            '<div style="display:flex;align-items:center;gap:0.4vh"><span style="padding:0.15vh 0.3vh;background:rgba(0,0,0,0.4);border-radius:0.3vh">I</span> Инвентарь</div>' +
            '<div style="display:flex;align-items:center;gap:0.4vh"><span style="padding:0.15vh 0.3vh;background:rgba(0,0,0,0.4);border-radius:0.3vh">X</span> Голос</div>' +
            '<div style="display:flex;align-items:center;gap:0.4vh"><span style="padding:0.15vh 0.3vh;background:rgba(0,0,0,0.4);border-radius:0.3vh">Z</span> Анимации</div>' +
            '<div style="display:flex;align-items:center;gap:0.4vh"><span style="padding:0.15vh 0.3vh;background:rgba(0,0,0,0.4);border-radius:0.3vh">F1</span> Помощь</div>';
        hud.appendChild(help);

        // ====== FREEZE ======
        var freeze = document.createElement('div');
        freeze.style.cssText = 'position:absolute;background:hsl(190deg 63% 66% / 40%);width:26.11vh;height:0.6vh;border-radius:0;outline:hsl(0deg 0% 0% / 20%) 0.2vh solid;outline-offset:0.1vh;overflow:hidden;left:7vh;bottom:2.78vh';
        freeze.innerHTML = '<span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:1.8vh;text-shadow:0 0 2vh #000;margin-right:1vh">Freeze:</span><span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:1.8vh;text-shadow:0 0 2vh #000" id="sbFreezeVal">100</span>';
        hud.appendChild(freeze);

        document.body.appendChild(hud);

        // Wanted stars (6 штук)
        var wr = document.getElementById('sbWantedWrap');
        for (var w = 0; w < 6; w++) {
            var star = document.createElement('img');
            star.src = icons.active_wanted;
            star.className = 'sb-wanted-star';
            star.style.cssText = 'width:2vh;height:1.6vh;opacity:0.3;transition:opacity .2s';
            wr.appendChild(star);
        }
    }

    // ============ Update Handlers (только то что есть в hudInfo) ============
    var updateFunctions = {
        show: function(v) { var el = document.getElementById('sbHudContainer'); if (el) el.style.display = +v >= 1 ? '' : 'none'; },
        showBars: function(v) { updateFunctions.show(v); },
        health: function(v) { updateBar('health', v); },
        armour: function(v) { updateBar('armour', v); },
        hunger: function(v) { updateBar('hunger', v); },
        breath: function(v) {
            var b = document.querySelector('.sb-breath');
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
            if (wrap) wrap.style.display = v >= 1 ? 'flex' : 'none';
        },
        ammoInClip: function(v) { var el = document.getElementById('sbAmmoInClip'); if (el) el.textContent = v; },
        totalAmmo: function(v) { var el = document.getElementById('sbAmmoTotal'); if (el) el.textContent = '/' + v; },
        wanted: function(v) {
            var stars = document.querySelectorAll('.sb-wanted-star');
            var level = Math.min(v, 6);
            stars.forEach(function(s, i) { s.style.opacity = i < level ? '1' : '0.3'; });
            var wrap = document.getElementById('sbWantedWrap');
            if (wrap) wrap.style.display = level > 0 ? 'flex' : 'none';
        },
        freeze: function(v) { var el = document.getElementById('sbFreezeVal'); if (el) el.textContent = String(v).padStart(3, '0'); },
        // Эти свойства приходят через setServer/setBonus
        server: function(id) {},
        bonus: function(v) {}
    };

    function updateBar(param, value) {
        var fill = document.querySelector('.sb-fill[data-p="' + param + '"]');
        var val = document.querySelector('.sb-pv[data-p="' + param + '"]');
        if (fill) fill.style.width = value + '%';
        if (val) val.textContent = value;
    }

    // ============ Реальное время (обновляется каждую секунду) ============
    function startClock() {
        setInterval(function() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var d = String(now.getDate()).padStart(2, '0');
            var mo = String(now.getMonth() + 1).padStart(2, '0');
            var timeEl = document.getElementById('sbTime');
            var dateEl = document.getElementById('sbDate');
            if (timeEl) timeEl.textContent = h + ':' + m;
            if (dateEl) dateEl.textContent = d + '.' + mo;
        }, 1000);
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

    // ============ Proxy Init ============
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
                window.interface("Hud").showGreenZoneTab = function() {};
                window.interface("Hud").hideGreenZoneTab = function() {};
                createHud();
                startClock();
                // Инициализация из текущих значений
                Object.keys(updateFunctions).forEach(function(key) {
                    if (key in hudInfo && typeof updateFunctions[key] === 'function') {
                        updateFunctions[key](hudInfo[key]);
                    }
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
// /color — Перекраска обводки радара
// ============================================================
(function() {
    if (window.__sbColorInit) return;
    window.__sbColorInit = true;
    var colorStyleNode = null;

    var colorPresets = [
        { name: 'Жёлтый',     hex: '#FFD600' },
        { name: 'Розовый',    hex: '#FF3676' },
        { name: 'Красный',    hex: '#E53935' },
        { name: 'Оранжевый',  hex: '#FF9800' },
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
        if (colorStyleNode) colorStyleNode.remove();
        var s = document.createElement('style');
        s.id = 'sb-color-override';
        s.textContent = '#app .hud-radmir-radar__map{border-color:' + color + ' !important}';
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
    window.sbHud.getColor = function() { return colorStyleNode ? true : false; };
})();
