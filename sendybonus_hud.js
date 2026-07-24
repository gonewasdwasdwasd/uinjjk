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

    var config = {
        serverName: 'SendyBonus',
        accentColor: '#FF3676'
    };

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
        css += '#app .hud-radmir-radar__radar-border_helloween{display:none !info}\n';
        css += '#app .hud-radmir-radar__radar-bats{display:none !important}\n';

        // Квадратный радар с обводкой
        css += '#app .hud-radmir-radar__map{width:21.9vh !important;height:20.9vh !important;overflow:hidden;display:flex;justify-content:center;align-items:center;border-radius:2vh;border:0.60vh solid ' + config.accentColor + ' !important}\n';
        css += 'body #app .hud-radmir-radar__map{transition:.3s}\n';
        css += '#app .hud-hassle-map{width:32vh !important;height:32vh !important}\n';
        css += '#app .hud-radmir-radar__radar{width:26.3vh}\n';
        css += '#app .hud-radmir-radar{left:7.8vh;bottom:4.03vh}\n';

        // Авторизация
        css += 'body .authorization{background:0 0 !important}\n';
        css += '#app .authorization{background-image:none !important;background-size:auto 100vh !important}\n';

        // Модалки
        css += '#app .modal-container-wrapper{background:rgba(0,0,0,0.8) !important;border:0.19vh solid #ffffff0d;border-radius:2.5vh !important}\n';
        css += '#app .modal-light__light{background:none !important}\n';
        css += '#app .modal-light__light_second{background:none !important}\n';
        css += '#app .modal-overlay{background:none !important}\n';

        // Чат
        css += '#app .radmir-chat-input__input{background:rgba(0,0,0,0.8) !important;border-radius:11px !important;border:1px solid rgba(255,255,255,0.08) !important}\n';
        css += '#app .radmir-chat-input__input input{margin-left:.9vh !important;color:#fff !important}\n';

        // Инвентарь
        css += '#app .inventory{background:none}\n';
        css += '#app .inventory-container__info__container{background:rgba(0,0,0,0.8) !important;border-radius:1.1vh}\n';
        css += '#app .inventory-extra__container,#app .inventory-main{background:rgba(0,0,0,0.8);border-radius:1.1vh;padding:2vh}\n';
        css += '#app .inventory-main__after,#app .inventory-main__before{display:none}\n';
        css += '#app .inventory-capacity,#app .inventory-container__box{border-radius:1vh;border:.1vh solid #ffffff26;background:radial-gradient(#00000003,#ffffff26 150%)}\n';

        // Трейд
        css += '#app .trade-items{background:none}\n';
        css += '#app .trade-items__container{border-radius:10px;background:rgba(0,0,0,0.8) !important}\n';

        // Топливо
        css += '#app .fuel__container{background:rgba(0,0,0,0.8);padding:3.33vh 2.96vh}\n';
        css += '#app .fuel__button{background:linear-gradient(185.93deg,#fff -22.13%,#e6e6e6 122.51%) !important;color:rgba(0,0,0,0.8) !important}\n';

        // Смерть
        css += '#app .death{font-style:italic;background:rgba(0,0,0,0.74) !important}\n';

        // Радиальное меню
        css += '#app .player-interaction__container{background:rgba(0,0,0,0.8);border:none}\n';
        css += '#app .player-interaction__title,.player-interaction__title_active{color:#fff !important}\n';
        css += '#app .player-interaction__icon{fill:white}\n';

        hudStyleElement.innerHTML = css;
        document.head.appendChild(hudStyleElement);

        // ===== HUD HTML =====
        var hud = document.createElement("div");
        hud.id = 'sbHudContainer';
        hud.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;font-family:GothamPro,sans-serif';

        // --- ЛОГО (верхний правый угол, из 5рп) ---
        var logoBlock = document.createElement('div');
        logoBlock.id = 'sbLogoBlock';
        logoBlock.style.cssText = 'position:absolute;top:20px;right:20px;text-align:right';
        logoBlock.innerHTML = '' +
            '<div id="sbLogoProject" style="display:inline-block;position:relative;font-family:GothamPro;font-size:14px;color:#fff">' +
            '<span id="sbLogoProjectType" style="font-weight:700">' + config.serverName + '</span>' +
            '</div>' +
            '<div id="sbLogoServer" style="font-family:GothamPro;font-weight:700;font-size:12px;color:#fff;text-transform:uppercase;text-shadow:0 2px 4px rgba(0,0,0,0.25);margin-top:4px">' +
            '<span id="sbServerName">' + config.serverName + '</span> ' +
            '<span id="sbOnlineCount" style="color:#7B93D1">0</span> ' +
            '<span id="sbPlayerId" style="color:#fff;font-weight:400">[0]</span>' +
            '</div>';
        hud.appendChild(logoBlock);

        // --- ИНФО ПАНЕЛЬ (нижний правый угол, из 5рп) ---
        var infoPanel = document.createElement('div');
        infoPanel.id = 'sbInfoPanelBlock';
        infoPanel.style.cssText = 'position:absolute;bottom:20px;right:20px;display:flex;align-items:center';
        infoPanel.innerHTML = '' +
            '<div id="sbInfoPanel" style="display:flex;align-items:center;padding:14px 22px 14px 30px;background:rgba(7,16,48,0.62);border-radius:41px 9px 9px 40px">' +
            '<div style="margin-left:10px">' +
            '<div style="display:flex;align-items:center">' +
            '<div style="font-family:GothamPro;font-weight:500;font-size:15px;color:#fff" id="sbTime">00:00</div>' +
            '<div style="font-family:GothamPro;font-weight:500;font-size:15px;color:#7B93D1;margin-left:auto" id="sbDate">00.00.0000</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;margin-top:4px">' +
            '<div style="font-family:GothamPro;font-weight:500;font-size:15px;color:#fff" id="sbMoney">$0</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        hud.appendChild(infoPanel);

        // --- ПАНЕЛЬ ПОДСКАЗОК (слева по центру, из 5рп) ---
        var helpPanel = document.createElement('div');
        helpPanel.id = 'sbHelpPanel';
        helpPanel.style.cssText = 'position:absolute;top:50%;left:20px;transform:translateY(-50%);font-family:GothamPro;font-size:14px;color:#fff;text-shadow:1px 1px 4px #000';
        helpPanel.innerHTML = '' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">I</span> Инвентарь</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">N</span> Микрофон</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">T</span> Чат</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">Y</span> Меню</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">U</span> Анимации</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">Ё</span> Курсор</div>' +
            '<div style="margin-top:5px;display:flex;align-items:center"><span style="min-width:20px;padding:2px 4px;margin-right:5px;background:rgba(0,0,0,0.4);border-radius:5px;text-transform:uppercase;text-align:center">F10</span> Помощь</div>';
        hud.appendChild(helpPanel);

        // --- НИЖНЯЯ ПАНЕЛЬ СЛЕВА (зона/улица + патроны, из 5рп) ---
        var bottomPanel = document.createElement('div');
        bottomPanel.id = 'sbBottomPanel';
        bottomPanel.style.cssText = 'position:absolute;bottom:1.05vw;left:17vw;display:flex;align-items:center;gap:8px';
        bottomPanel.innerHTML = '' +
            '<div style="padding:10px;background:rgba(7,16,48,0.5);border-radius:9px">' +
            '<div style="font-family:GothamPro;font-weight:600;font-size:14px;color:#30A8FF" id="sbStreet">Шоссе Сенора</div>' +
            '<div style="font-family:GothamPro;font-weight:400;font-size:14px;color:rgba(255,255,255,0.7)" id="sbCrossing">Гора Чиллиад</div>' +
            '</div>' +
            '<div id="sbAmmoBlock" style="display:none;background:rgba(7,16,48,0.5);border-radius:9px;padding:8px 12px;align-items:center;gap:8px">' +
            '<div style="font-family:GothamPro;font-weight:500;font-size:18px;color:#fff" id="sbAmmoValue">0</div>' +
            '</div>';
        hud.appendChild(bottomPanel);

        // --- СТАТУС БАРЫ (из примера жс кода, правая сторона) ---
        var hudTop = document.createElement('div');
        hudTop.style.cssText = 'position:absolute;right:1.4vw;top:3.4vh;display:flex;flex-direction:column;align-items:flex-end';
        hudTop.innerHTML = '' +
            '<div style="position:relative;margin-bottom:3vh" id="sbLogoWrap">' +
            '<img id="sbLogoImg" src="' + logoImages[1] + '" style="width:20.52vh;height:6.2vh;margin-right:2vh">' +
            '<div id="sbBonus" style="background:rgba(0,0,0,1);width:33px;height:33px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;position:absolute;bottom:-5px;right:-2px;border-radius:50%;font-family:GothamPro;font-size:1.49vh">x3</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;margin-top:.46vh;margin-right:3.46vh">' +
            '<div style="height:13.5vh;position:relative;z-index:1">' +
            '<div style="display:flex;align-items:center;justify-content:flex-end;color:white;font-family:GothamPro;font-weight:900;font-style:italic;font-size:2.59vh;text-shadow:0 0 .46vh #000000cb">' +
            '<img src="' + icons.cash + '" style="margin-right:13px;margin-top:1px"><span id="sbCashVal">0</span>' +
            '</div>' +
            '<div style="margin-top:1vh">' +
            '<div class="sb-param health" style="display:flex;align-items:center;margin-top:0;margin-left:1.89vh">' +
            '<img src="' + icons.health + '" class="old-param__icon" style="margin-right:0.8vh;margin-top:-0.2vh">' +
            '<div style="width:9.40vh;height:.46vh;background-color:#0000004d;border-radius:.46vh"><div class="sb-bar-fill" data-param="health" style="width:100%;height:100%;background-color:rgba(237,46,46,1);border-radius:.46vh"></div></div>' +
            '<span class="sb-param-val" data-param="health" style="margin-left:.93vh;font-family:GothamPro;font-weight:300;font-style:italic;color:white;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>' +
            '<div class="sb-param armour" style="display:flex;align-items:center;margin-top:.95vh">' +
            '<img src="' + icons.armour + '" class="old-param__icon" style="margin-right:0.8vh;margin-top:-0.2vh">' +
            '<div style="width:9.40vh;height:.46vh;background-color:#0000004d;border-radius:.46vh"><div class="sb-bar-fill" data-param="armour" style="width:0%;height:100%;background-color:rgba(82,110,230,1);border-radius:.46vh"></div></div>' +
            '<span class="sb-param-val" data-param="armour" style="margin-left:.93vh;font-family:GothamPro;font-weight:300;font-style:italic;color:white;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">0</span>' +
            '</div>' +
            '<div class="sb-param hunger" style="display:flex;align-items:center;margin-top:.95vh;margin-left:-0.25vh">' +
            '<img src="' + icons.hunger + '" class="old-param__icon" style="margin-right:0.8vh;margin-top:-0.2vh">' +
            '<div style="width:9.40vh;height:.46vh;background-color:#0000004d;border-radius:.46vh"><div class="sb-bar-fill" data-param="hunger" style="width:100%;height:100%;background-color:rgba(255,135,46,1);border-radius:.46vh"></div></div>' +
            '<span class="sb-param-val" data-param="hunger" style="margin-left:.93vh;font-family:GothamPro;font-weight:300;font-style:italic;color:white;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>' +
            '<div class="sb-param breath" style="display:flex;align-items:center;margin-top:.95vh;display:none">' +
            '<img src="' + icons.breath + '" class="old-param__icon" style="margin-right:0.8vh;margin-top:-0.2vh;width:1.7vh;height:1.7vh">' +
            '<div style="width:9.40vh;height:.46vh;background-color:#0000004d;border-radius:.46vh"><div class="sb-bar-fill" data-param="breath" style="width:100%;height:100%;background-color:rgba(79,195,247,1);border-radius:.46vh"></div></div>' +
            '<span class="sb-param-val" data-param="breath" style="margin-left:.93vh;font-family:GothamPro;font-weight:300;font-style:italic;color:white;width:3.24vh;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3">100</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="sbWeaponWrap" style="width:16.6vh;height:16.6vh;position:relative;display:flex;justify-content:flex-end;margin-left:-.93vh;margin-right:.46vh;visibility:hidden">' +
            '<img id="sbWeaponBack" src="' + icons.wanted_back + '" style="position:absolute;right:-1.4vh;top:-1.6vh;z-index:-1">' +
            '<img id="sbWeaponIcon" src="" style="width:40vh;height:17.6vh">' +
            '<div id="sbAmmoClip" style="position:absolute;bottom:5.6vh;right:6vh;display:flex;align-items:flex-end;color:#fff;gap:3.4vh">' +
            '<span style="font-family:GothamPro;font-weight:700;font-style:italic;font-size:2.31vh;line-height:1;text-shadow:0 0 .46vh #00000080" id="sbAmmoInClip">0</span>' +
            '<span style="font-family:GothamPro;font-weight:300;font-style:italic;font-size:1.67vh;text-shadow:0 0 .46vh #000000b3" id="sbAmmoTotal"> /0</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="sbWantedWrap" style="position:relative;margin-right:6vh;margin-top:-1.6vh;transform:translateY(60%);display:none">' +
            '<img src="' + icons.weapon_back + '" style="position:absolute;right:-1.2vh;top:-0.66vh;z-index:-1">' +
            '<div id="sbWantedRow" style="display:flex;flex-direction:row-reverse;align-items:center"></div>' +
            '</div>' +
            '</div>';
        hud.appendChild(hudTop);

        // --- FREEZE ---
        var freeze = document.createElement('div');
        freeze.id = 'sbFreezeWrap';
        freeze.style.cssText = 'position:absolute;background:hsl(190deg 63% 66% / 40%);width:26.1111vh;height:0.65vh;border-radius:1vh;outline:hsl(0deg 0% 0% / 20%) 0.2vh solid;outline-offset:0.1vh;overflow:hidden;left:11.1620vh;bottom:2.7778vh';
        freeze.innerHTML = '<span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:2vh;text-shadow:0 0 2vh #000;margin-right:1vh">Freeze:</span><span style="font-family:GothamPro;font-weight:700;color:#c0ccec;font-size:2vh;text-shadow:0 0 2vh #000" id="sbFreezeVal">100</span>';
        hud.appendChild(freeze);

        document.body.appendChild(hud);

        // Wanted stars
        var wantedRow = document.getElementById('sbWantedRow');
        for (var w = 0; w < 6; w++) {
            var star = document.createElement('img');
            star.src = icons.inactive_wanted;
            star.style.cssText = 'width:2.3vh;height:1.8vh;padding:0.19vh 0.28vh';
            wantedRow.appendChild(star);
        }
    }

    // ============ Update Handlers ============
    var updateFunctions = {
        show: function(v) {
            var el = document.getElementById('sbHudContainer');
            if (el) el.style.display = +v >= 1 ? '' : 'none';
        },
        showBars: function(v) { updateFunctions.show(v); },
        health: function(v) { updateBar('health', v); },
        armour: function(v) { updateBar('armour', v); },
        hunger: function(v) { updateBar('hunger', v); },
        breath: function(v) {
            var p = document.querySelector('.sb-param.breath');
            if (p) p.style.display = v < 99 ? 'flex' : 'none';
            updateBar('breath', v);
        },
        money: function(v) {
            var el = document.getElementById('sbCashVal');
            if (el) el.textContent = formatNumberWithDots(v);
            var el2 = document.getElementById('sbMoney');
            if (el2) el2.textContent = '$' + formatNumberWithDots(v);
        },
        weapon: function(v) {
            var icon = document.getElementById('sbWeaponIcon');
            var wrap = document.getElementById('sbWeaponWrap');
            if (icon && weaponIcons[v]) icon.src = weaponIcons[v];
            if (wrap) wrap.style.visibility = v >= 1 ? 'visible' : 'hidden';
        },
        ammoInClip: function(v) {
            var el = document.getElementById('sbAmmoInClip');
            if (el) el.textContent = v;
        },
        totalAmmo: function(v) {
            var el = document.getElementById('sbAmmoTotal');
            if (el) el.textContent = ' ' + v;
        },
        wanted: function(v) {
            var stars = document.querySelectorAll('#sbWantedRow img');
            stars.forEach(function(s, i) { s.src = i < v ? icons.active_wanted : icons.inactive_wanted; });
            var wrap = document.getElementById('sbWantedWrap');
            if (wrap) wrap.style.display = v > 0 ? '' : 'none';
        },
        server: function(id) {
            var img = document.getElementById('sbLogoImg');
            if (img) {
                if (id <= 0) { img.style.display = 'none'; return; }
                img.style.display = '';
                if (logoImages[id]) img.src = logoImages[id];
            }
        },
        bonus: function(v) {
            var el = document.getElementById('sbBonus');
            if (el) { el.style.display = v <= 1 ? 'none' : ''; el.textContent = 'x' + v; }
        },
        freeze: function(v) {
            var el = document.getElementById('sbFreezeVal');
            if (el) el.textContent = String(v).padStart(3, '0');
        },
        time: function(v) {
            var el = document.getElementById('sbTime');
            if (el) el.textContent = v;
        },
        date: function(v) {
            var el = document.getElementById('sbDate');
            if (el) el.textContent = v;
        },
        street: function(v) {
            var el = document.getElementById('sbStreet');
            if (el) el.textContent = v;
        },
        crossingRoad: function(v) {
            var el = document.getElementById('sbCrossing');
            if (el) el.textContent = v;
        },
        online: function(v) {
            var el = document.getElementById('sbOnlineCount');
            if (el) el.textContent = v;
        },
        playerId: function(v) {
            var el = document.getElementById('sbPlayerId');
            if (el) el.textContent = '[' + v + ']';
        },
        ammo: function(v) {
            var el = document.getElementById('sbAmmoBlock');
            var val = document.getElementById('sbAmmoValue');
            if (el) el.style.display = v > 0 ? 'flex' : 'none';
            if (val) val.textContent = v;
        },
        greenZone: function(v) {}
    };

    function updateBar(param, value) {
        var fill = document.querySelector('.sb-bar-fill[data-param="' + param + '"]');
        var val = document.querySelector('.sb-param-val[data-param="' + param + '"]');
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

    // ============ Proxy ============
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
                if ('bonus' in window.interface("Hud")) updateFunctions.bonus(window.interface("Hud").bonus);
            }
        }, 100);
    }

    initializeHudProxy();
    window.onInfoChange = onInfoChange;
}
AddHud();

// ============================================================
// /color — Смена цвета обводки радара
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
        s.textContent = '#app .hud-radmir-radar__map{border:0.60vh solid ' + color + ' !important}';
        document.head.appendChild(s);
        colorStyleNode = s;
    }

    function openColorMenu() {
        var list = colorPresets.map(function(p) { return p.name; }).join('<n>');
        window.addDialogInQueue('[0,2,"Цвет худа","Выберите цвет:","Выбрать","Закрыть",0,0]', list, 0);
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
