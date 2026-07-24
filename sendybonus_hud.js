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
        health: iconBase + 'health.png', armour: iconBase + 'armour.png',
        hunger: iconBase + 'hunger.png', breath: iconBase + 'breath.png',
        cash: iconBase + 'cash.png', active_wanted: iconBase + 'active_wanted.png'
    };
    var weaponIcons = {};
    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,42,43,44,45,46].forEach(function(id) { weaponIcons[id] = weaponBase + id + '.png'; });

    function createHud() {
        hudStyleElement = document.createElement("style");
        hudStyleElement.id = "sbHudStyles";
        var css = '';
        // ШРИФТЫ
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Black/GothamPro-Black.ttf) format("truetype");font-weight:900;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Bold/GothamPro-Bold.ttf) format("truetype");font-weight:700;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Medium/GothamPro-Medium.ttf) format("truetype");font-weight:500;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Regular/GothamPro.ttf) format("truetype");font-weight:400;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-Light/GothamPro-Light.ttf) format("truetype");font-weight:300;font-style:normal}\n';
        css += '@font-face{font-family:GothamPro;src:url(https://raw.githubusercontent.com/goasdasnda/fonts/main/fonts/GothamPro-LightItalic/GothamPro-LightItalic.ttf) format("truetype");font-weight:300;font-style:italic}\n';
        // СКРЫТИЕ ДЕФОЛТА
        css += '#app .hud-radmir-wanted{display:none}\n';
        css += 'body #app .hud-radmir-info{display:none}\n';
        css += '.hud-hassle-map .map-mask{display:none}\n';
        css += '#app .hud-radmir-radar__map{border-radius:0 !important;border:0.2vh solid #FFD600 !important}\n';
        css += '#app .hud-radmir-radar{left:5vh !important;bottom:4vh !important}\n';
        // АВТОРИЗАЦИЯ
        css += '#app .authorization{background:0 0 !important;display:flex;justify-content:center;align-items:center;height:100vh;margin-top:0 !important}\n';
        css += '#app .authorization__bg{display:none !important}\n';
        css += '#app .login-auth:before,#app .login-code:before,#app .registration:before{content:"";background-image:url(hud/авторизация.png);background-size:cover;width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:-1}\n';
        css += '#app .authorization-field{height:4.63vh;box-sizing:border-box;border:.19vh solid #ffffff91;border-radius:.74vh;color:#ffffffd6;font-size:1.3vh;width:46.48vh;position:relative;font-weight:400;background:#00000054;font-family:GothamPro,sans-serif}#app .authorization-field__input{color:#ffffffd6 !important;font-size:1.3vh;border:none !important;font-family:GothamPro,sans-serif}\n';
        css += '#app .login-form__button,#app .registration-form__button{padding:0 4.63vh;height:6.11vh;border-radius:.74vh;line-height:6.11vh;font-size:2.04vh;font-weight:500;width:17vh;margin-left:50%;left:50%;transform:translateX(-50%)}\n';
        // СПИДОМЕТР
        css += 'body #app .hud-radmir-speedometer-secondary__data__before{background-image:none}body #app .hud-radmir-speedometer__after{display:none}body #app .hud-radmir-speedometer{right:1.2vh;bottom:1.5vh;padding-right:1vh;transition:none !important}body #app .hud-radmir-speedometer-main__hidden{opacity:1}\n';
        css += 'body #app .hud-radmir-speedometer:after{content:"";position:absolute;width:32vh;height:8vh;background:#000000cc;border-radius:.7vh;right:1vh;bottom:1vh;z-index:-1}\n';
        css += 'body #app .hud-radmir-speedometer-hint{width:0;height:0;background-image:none;display:none}body #app .hud-radmir-speedometer__new-year{display:none}body #app .hud-radmir-speedometer-main__speed{width:32vh;height:8vh}body #app .hud-radmir-speedometer-main__turns{display:none}body #app .hud-radmir-speedometer-main__speed-fill{display:none}\n';
        css += 'body #app .hud-radmir-speedometer-main__data{flex-direction:row !important;padding:0;margin:0;position:absolute;top:-3vh;left:1vh}body #app .hud-radmir-speedometer-main__data-value{font-weight:700;font-size:3vh;color:#fff;text-shadow:none;font-family:GothamPro;font-style:normal;text-align:left}body #app .hud-radmir-speedometer-main__data-text{font-weight:700;font-size:2vh;text-shadow:none;font-family:GothamPro;font-style:normal;color:#bdbdbd;margin-left:.5vh;margin-top:0}\n';
        css += 'body #app .hud-radmir-speedometer-indicators{width:5.3vh;height:5.3vh;margin-left:0;margin-top:0;position:absolute;display:flex;bottom:2.5vh;right:1vh;gap:1.8vh}body #app .hud-radmir-speedometer-indicators__item{width:4vh;height:4vh;margin-right:1vh !important}body #app .hud-radmir-speedometer-indicators__item svg path{fill:#fff !important}\n';
        css += 'body #app .hud-radmir-speedometer-mileage{height:2vh;bottom:1.96vh;right:1vh;padding:0;-webkit-mask-image:none !important;mask-image:none !important}body #app .hud-radmir-speedometer-mileage__container{grid-template-columns:repeat(7,1.4vh);gap:.9vh;grid-gap:0vh}body #app .hud-radmir-speedometer-mileage__item{border-bottom:none;height:1.3vh;padding-bottom:2vh;margin-right:.15vh}body #app .hud-radmir-speedometer-mileage__item-value{font-weight:300;font-size:1.9vh;line-height:1.86vh;color:#fff;text-shadow:none;font-family:GothamPro;font-style:normal;transition:none !important}\n';
        css += '#app .hud-radmir-speedometer-secondary{width:11vh;height:2.5vh;display:flex;align-items:center;position:absolute;left:-2vh;bottom:2.1vh}body #app .hud-radmir-speedometer-secondary__fuel{padding:0;position:relative;left:0;top:0}body #app .hud-radmir-speedometer-secondary__fill{display:none}body #app .hud-radmir-speedometer-secondary__data-value{font-family:GothamPro;font-weight:400;font-size:2.2vh;color:#fff;text-shadow:none}body #app .hud-radmir-speedometer-secondary__data-text{display:none}\n';
        // ИНТЕРФЕЙСЫ
        css += 'body .info-card{background:rgba(0,0,0,0.7);border-radius:31px !important}body .info-card__data{background:rgba(0,0,0,0.6);border-radius:31px}body .info-card .text{color:#cfcfcf}\n';
        css += '#app .modal-container-wrapper{background:rgba(0,0,0,0.8) !important;border:0.19vh solid #FFD60020;border-radius:2.5vh !important}#app .modal_violet .modal-container{border-top:none !important}#app .modal-light__light,#app .modal-light__light_second,#app .modal-overlay{background:none !important}#app .modal_violet .modal-container-wrapper,#app .modal_orange .modal-container-wrapper,#app .modal_green .modal-container-wrapper,#app .modal_red .modal-container-wrapper,#app .modal_dark-orange .modal-container-wrapper{box-shadow:none !important}#app .modal_violet .modal-container,#app .modal_orange .modal-container,#app .modal_green .modal-container,#app .modal_red .modal-container,#app .modal_dark-orange .modal-container{border-top:none !important}\n';
        css += 'body .window-bg{background-image:none}body .window__before{background-image:none}body .window__title{text-align:center;color:#fff}\n';
        css += 'body .window-table__item{color:#fff;border-radius:2vh;border:.09vh solid #ffffff00;transition:.25s}body .window-table__item:before{border-radius:3vh;background:linear-gradient(rgba(59,59,59,0.161),rgba(59,59,59,0.161))}body .window-table__item:after{background:rgba(59,59,59,0.161);border-radius:3vh}body .window-table__item.selected{background:#FFD600;color:#000;border:.09vh solid #FFD600}body .window-table__item:hover{background:#ffffff50}body .window-table__item.selected:hover{background:#FFD600;color:#000}\n';
        css += 'body .window-button{border-radius:2vh;color:#fff;background:rgba(59,59,59,0.161)}#app .window-button:hover{color:#000;background:#FFD600}#app .window-button:first-child{background:#FFD600 !important}#app .window-button:first-child:hover{background:#fff !important}\n';
        css += '.graffiti-pattern__image[data-v-38ff9a6b]{background:none !important}\n';
        // ЧАТ
        css += '#app .radmir-chat-input__input{background:rgba(0,0,0,0.8) !important;border-radius:11px !important;border:1px solid rgba(255,215,0,0.15) !important}#app .radmir-chat-input__input input::selection{background-color:#FFD60040}#app .radmir-chat-input__input input{margin-left:.9vh !important}#app .radmir-chat-input__input-lang{margin-right:1vh !important}#app .controls-button{border-radius:.5vh}\n';
        // ТРЕЙД
        css += '#app .trade-items__container{border-radius:10px;height:613px;width:1283px;background:rgba(0,0,0,0.74) !important}#app .trade-items{background:none}#app .trade-items-main{right:-1.2vw;top:-2vh}\n';
        // ИНВЕНТАРЬ
        css += '#app .inventory{background:none}#app .inventory-container__info__container{background:rgba(0,0,0,0.8) !important;border-radius:1.1vh}#app .inventory-action__modal,#app .inventory-extra__container,#app .inventory-main{background:rgba(0,0,0,0.8)}#app .inventory-main__after,#app .inventory-main__before{display:none}#app .inventory-extra__container,#app .inventory-main{padding:2vh;background:rgba(0,0,0,0.8);border-radius:1.1vh;border:0}#app .inventory-player{border:none}#app .inventory-capacity,#app .inventory-container__box{border-radius:1vh;border:.1vh solid #FFD60026;background:radial-gradient(#00000003,#FFD60015 150%)}#app .inventory-container__slot{border-radius:1vh;background:radial-gradient(#00000003,#ffffff33)}#app .inventory-capacity__bar,#app .inventory-wear__bar{background:#FFD60033;border-radius:1vh;width:100%}#app .inventory-container__slot:before{border-radius:1vh;border:.1vh solid #FFD600;background:radial-gradient(#00000003,#ffffffcc 150%)}#app .inventory-action__modal{padding:2vh;background:rgba(0,0,0,0.8);border-radius:1.1vh}\n';
        // ТОПЛИВО
        css += '#app .fuel__container{background:rgba(0,0,0,0.8);padding:3.33vh 2.96vh}#app .fuel__button{background:linear-gradient(185.93deg,#FFD600 -22.13%,#FFB800 122.51%) !important;color:#000 !important}#app .fuel__class-col.selected,.fuel__class-col:hover{background:#FFD600 !important;color:#000 !important}#app .fuel__fill .range-slider-fill{background-color:#FFD600 !important}#app .fuel__fill .range-slider-knob{background:#FFD600 !important}\n';
        // СМЕРТЬ
        css += '#app .death{font-style:italic;background:rgba(0,0,0,0.74) !important}#app .death-timer{font-style:italic}\n';
        // РАДИАЛЬНОЕ МЕНЮ
        css += '#app .player-interaction__container{background:rgba(0,0,0,0.8);border:none}#app .player-interaction__title,.player-interaction__title_active{color:#fff !important}#app .player-interaction__icon{fill:white}#app .player-interaction-favorite{background:rgba(0,0,0,0.8)}#app .player-interaction-favorite:hover{background:rgba(255,215,0,0.2)}#app .player-interaction__container:after,.player-interaction__container:before{background:0 0 !important}#app .container{background:rgba(0,0,0,0.8)}#app .vue3-slider .track-filled,.vue3-slider .handle{background-color:#FFD600 !important}\n';
        hudStyleElement.innerHTML = css;
        document.head.appendChild(hudStyleElement);

        var hud = document.createElement("div");
        hud.id = 'sbHudContainer';
        hud.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;font-family:GothamPro,sans-serif';

        // ЛОГО
        var logo = document.createElement('div');
        logo.style.cssText = 'position:absolute;top:15px;right:20px;text-align:right';
        logo.innerHTML = '<div style="font-family:GothamPro;font-weight:900;font-size:3.2vh;line-height:1;text-shadow:0 2px 8px rgba(0,0,0,0.5)"><span style="color:#fff">SENDY</span><span style="color:#FFD600">BONUS</span></div>';
        hud.appendChild(logo);

        // ДЕНЬГИ
        var cashEl = document.createElement('div');
        cashEl.style.cssText = 'position:absolute;top:10vh;right:20px;text-align:right;display:flex;align-items:center;justify-content:flex-end;color:white;font-family:GothamPro;font-weight:900;font-style:italic;font-size:2.59vh;text-shadow:0 0 .46vh #000000cb';
        cashEl.innerHTML = '<span style="display:inline-flex;align-items:center;justify-content:center;width:2.8vh;height:2.8vh;background:#FFD600;border-radius:0.4vh;font-size:1.8vh;font-style:normal;font-weight:900;color:#000;margin-right:0.8vh">Р</span><span id="sbCashVal">0</span>';
        hud.appendChild(cashEl);

        // БАРЫ (нижняя рамка радара)
        var bars = document.createElement('div');
        bars.style.cssText = 'position:absolute;bottom:3.4vh;left:5vh;display:flex;gap:0.4vh;align-items:flex-start;width:22vh';
        bars.innerHTML = '' +
            '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3vh"><div style="width:100%;height:0.6vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="health" style="width:100%;height:100%;background:#ed2e2e;transition:width .3s"></div></div><div style="display:flex;align-items:center;gap:0.4vh"><img src="' + icons.health + '" style="width:1.4vh;height:1.2vh"><span class="sb-pv" data-p="health" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;font-size:1.3vh">100</span></div></div>' +
            '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3vh"><div style="width:100%;height:0.6vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="armour" style="width:0%;height:100%;background:#526ee6;transition:width .3s"></div></div><div style="display:flex;align-items:center;gap:0.4vh"><img src="' + icons.armour + '" style="width:1.4vh;height:1.4vh"><span class="sb-pv" data-p="armour" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;font-size:1.3vh">0</span></div></div>' +
            '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3vh"><div style="width:100%;height:0.6vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="hunger" style="width:100%;height:100%;background:#ff872e;transition:width .3s"></div></div><div style="display:flex;align-items:center;gap:0.4vh"><img src="' + icons.hunger + '" style="width:1vh;height:1.2vh"><span class="sb-pv" data-p="hunger" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;font-size:1.3vh">100</span></div></div>' +
            '<div class="sb-breath" style="display:none;flex:1;flex-direction:column;align-items:center;gap:0.3vh"><div style="width:100%;height:0.6vh;background:#0000004d;border-radius:0"><div class="sb-fill" data-p="breath" style="width:100%;height:100%;background:#4fc3f7;transition:width .3s"></div></div><div style="display:flex;align-items:center;gap:0.4vh"><img src="' + icons.breath + '" style="width:1.6vh;height:1.6vh"><span class="sb-pv" data-p="breath" style="font-family:GothamPro;font-weight:300;font-style:italic;color:#fff;font-size:1.3vh">100</span></div></div>';
        hud.appendChild(bars);

        // WANTED
        var wantedWrap = document.createElement('div');
        wantedWrap.id = 'sbWantedWrap';
        wantedWrap.style.cssText = 'position:absolute;top:14.5vh;right:20px;display:none;align-items:center;gap:0.2vh';
        hud.appendChild(wantedWrap);

        // ОРУЖИЕ
        var weaponWrap = document.createElement('div');
        weaponWrap.id = 'sbWeaponWrap';
        weaponWrap.style.cssText = 'position:absolute;bottom:65px;right:20px;display:none;align-items:center;gap:8px;padding:6px 14px;background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.3);border-radius:9px';
        weaponWrap.innerHTML = '<img id="sbWeaponIcon" src="" style="width:5vh;height:2.5vh;object-fit:contain"><div style="display:flex;align-items:baseline;gap:2px"><span style="font-family:GothamPro;font-weight:700;font-style:italic;font-size:1.3vh;color:#FFD600" id="sbAmmoInClip">0</span><span style="font-family:GothamPro;font-weight:300;font-style:italic;font-size:0.9vh;color:rgba(255,215,0,0.5)" id="sbAmmoTotal">/0</span></div>';
        hud.appendChild(weaponWrap);

        // ВРЕМЯ
        var timePanel = document.createElement('div');
        timePanel.id = 'sbTimeWrap';
        timePanel.style.cssText = 'position:absolute;bottom:20px;right:20px;display:flex;align-items:center;padding:14px 24px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:9px;gap:16px;transition:right .3s';
        timePanel.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD600"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg><span style="font-family:GothamPro;font-weight:500;font-size:14px;color:#FFD600" id="sbTime">--:--:--</span><span style="font-family:GothamPro;font-weight:400;font-size:13px;color:rgba(255,215,0,0.5)" id="sbDate">--.--</span>';
        hud.appendChild(timePanel);

        // ПОДСКАЗКИ СПРАВА ОТ РАДАРА (ИСПРАВЛЕНО)
        var help = document.createElement('div');
        help.id = 'sbHelpPanel';
        help.style.cssText = 'position:absolute;bottom:4vh;left:calc(5vh + 22vh + 1.5vh);display:flex;flex-direction:column;gap:0.5vh;font-family:GothamPro;font-size:1.2vh;color:rgba(255,255,255,0.7);text-shadow:0 1px 4px rgba(0,0,0,0.8);background:rgba(0,0,0,0.3);padding:0.8vh 1.2vh;border-radius:0.6vh;border:1px solid rgba(255,215,0,0.1);backdrop-filter:blur(4px);';
        help.innerHTML = '' +
            '<div style="display:flex;align-items:center;gap:0.6vh;transition:0.2s"><span style="padding:0.2vh 0.6vh;background:rgba(255,215,0,0.15);border-radius:0.3vh;font-weight:700;color:#FFD600;font-size:0.9vh">M</span> <span style="font-weight:300">Меню</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh;transition:0.2s"><span style="padding:0.2vh 0.6vh;background:rgba(255,215,0,0.15);border-radius:0.3vh;font-weight:700;color:#FFD600;font-size:0.9vh">I</span> <span style="font-weight:300">Инвентарь</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh;transition:0.2s"><span style="padding:0.2vh 0.6vh;background:rgba(255,215,0,0.15);border-radius:0.3vh;font-weight:700;color:#FFD600;font-size:0.9vh">X</span> <span style="font-weight:300">Голос</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh;transition:0.2s"><span style="padding:0.2vh 0.6vh;background:rgba(255,215,0,0.15);border-radius:0.3vh;font-weight:700;color:#FFD600;font-size:0.9vh">Z</span> <span style="font-weight:300">Анимации</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.6vh;transition:0.2s"><span style="padding:0.2vh 0.6vh;background:rgba(255,215,0,0.15);border-radius:0.3vh;font-weight:700;color:#FFD600;font-size:0.9vh">F1</span> <span style="font-weight:300">Помощь</span></div>';
        hud.appendChild(help);

        // ID + ONLINE (ИСПРАВЛЕНО ДЛЯ SAMP/CRMP)
        var cards = document.createElement('div');
        cards.id = 'sbCards';
        cards.style.cssText = 'position:absolute;bottom:14vh;left:calc(5vh + 22vh + 1.5vh);display:flex;flex-direction:column;gap:0.5vh;';
        
        // ID - Будет обновляться через updateFunctions
        var idBlock = document.createElement('div');
        idBlock.id = 'sbIdBlock';
        idBlock.style.cssText = 'display:flex;align-items:center;gap:0.6vh;padding:0.4vh 0.8vh;background:rgba(0,0,0,0.5);border-radius:0.4vh;font-family:GothamPro;font-size:1.3vh;color:#fff;border:1px solid rgba(255,215,0,0.08);';
        idBlock.innerHTML = '<span style="color:#FFD600;font-weight:700">ID</span><span style="font-weight:500" id="sbPlayerId">—</span>';
        cards.appendChild(idBlock);
        
        // ONLINE - Фикс для SAMP/CRMP
        var onlineBlock = document.createElement('div');
        onlineBlock.id = 'sbOnlineBlock';
        onlineBlock.style.cssText = 'display:flex;align-items:center;gap:0.6vh;padding:0.4vh 0.8vh;background:rgba(0,0,0,0.5);border-radius:0.4vh;font-family:GothamPro;font-size:1.3vh;color:#fff;border:1px solid rgba(255,215,0,0.08);';
        onlineBlock.innerHTML = '<svg width="1.2vh" height="1.2vh" viewBox="0 0 24 24" fill="#FFD600"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span id="sbOnlineCount" style="font-weight:500">—</span>';
        cards.appendChild(onlineBlock);
        
        hud.appendChild(cards);

        document.body.appendChild(hud);

        // Wanted stars
        var wr = document.getElementById('sbWantedWrap');
        for (var w = 0; w < 6; w++) {
            var star = document.createElement('img');
            star.src = icons.active_wanted;
            star.className = 'sb-wanted-star';
            star.style.cssText = 'width:2vh;height:1.6vh;opacity:0.3;transition:opacity .2s';
            wr.appendChild(star);
        }
    }

    var updateFunctions = {
        show: function(v) { var el = document.getElementById('sbHudContainer'); if (el) el.style.display = +v >= 1 ? '' : 'none'; },
        showBars: function(v) { updateFunctions.show(v); },
        health: function(v) { updateBar('health', v); },
        armour: function(v) { updateBar('armour', v); },
        hunger: function(v) { updateBar('hunger', v); },
        breath: function(v) { var b = document.querySelector('.sb-breath'); if (b) b.style.display = v < 99 ? 'flex' : 'none'; updateBar('breath', v); },
        money: function(v) { var el = document.getElementById('sbCashVal'); if (el) el.textContent = formatNumberWithDots(v); },
        weapon: function(v) { 
            var icon = document.getElementById('sbWeaponIcon'); 
            var wrap = document.getElementById('sbWeaponWrap'); 
            if (icon && weaponIcons[v]) icon.src = weaponIcons[v]; 
            if (wrap) wrap.style.display = (v >= 1 && v <= 46) ? 'flex' : 'none'; 
        },
        ammoInClip: function(v) { var el = document.getElementById('sbAmmoInClip'); if (el) el.textContent = v; },
        totalAmmo: function(v) { var el = document.getElementById('sbAmmoTotal'); if (el) el.textContent = '/' + v; },
        wanted: function(v) { 
            var stars = document.querySelectorAll('.sb-wanted-star'); 
            var level = Math.min(Math.max(v, 0), 6); 
            stars.forEach(function(s, i) { s.style.opacity = i < level ? '1' : '0.3'; }); 
            var wrap = document.getElementById('sbWantedWrap'); 
            if (wrap) wrap.style.display = level > 0 ? 'flex' : 'none'; 
        },
        freeze: function(v) {},
        server: function(id) {},
        bonus: function(v) {},
        playerId: function(v) { 
            var el = document.getElementById