/**
 * workshop-patch.js
 * 寻遗集 · 天工阁升级补丁
 *
 * 必须在 workshop.js + bond-engine.js 之后加载。
 *
 * 升级内容：
 *   1. _buildInheritorCard  — 真实进度 + 全部按钮实装 + 节气 + 羁绊
 *   2. renderWorkshop       — 顶部节气横幅 + 传习录/订单快捷入口
 *   3. renderInheritorDash  — B端新增订单面板 + 批注入口 + 节气横幅
 *   4. buyItem (商店)       — 购买实体品自动生成 O2O 订单
 */

'use strict';

// ============================================================
// 一、C端工坊卡片重写（功能全部实装）
// ============================================================
(function patchBuildInheritorCard() {
    window._buildInheritorCard = function(inheritor, idx) {
        const levelColor  = inheritor.level === '国家级' ? 'var(--gold)' : 'var(--jade)';
        const progress    = inheritor.progress || 0;
        const canTransfer = progress >= 100;

        // 节气加成徽标
        let bonusBadge = '';
        if (typeof SolarTermEngine !== 'undefined') {
            const term     = SolarTermEngine.getCurrentTerm();
            const hasBonus = term.bonus === inheritor.category || term.bonus === 'all';
            if (hasBonus) bonusBadge = `
                <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(90deg,rgba(212,175,55,.14),transparent);
                            font-size:11px;color:var(--gold);padding:4px 12px;
                            border-top:1px dashed rgba(212,175,55,.2);">
                    ✨ ${term.icon}${term.name} · 研习奖励 ×1.5
                </div>`;
        }

        // 羁绊等级徽标
        let bondBadge = '';
        if (typeof BondSystem !== 'undefined') {
            const bond = BondSystem.getLevel(inheritor.name);
            bondBadge  = `<div style="font-size:10px;color:${bond.color};margin-top:2px;">💛 ${bond.name}</div>`;
        }

        // 已完成活动数
        const doneMap  = gameState[`inh_prog_${inheritor.id}`] || {};
        const doneCount = Object.keys(doneMap).length;
        const totalActs = (inheritor.workshopActivities || []).length;

        return `
        <div class="workshop-card scroll-reveal"
             style="animation-delay:${idx * 0.06}s;position:relative;overflow:hidden;
                    padding-bottom:${bonusBadge ? '36px' : '16px'};">
            <span class="workshop-level-badge"
                  style="background:${levelColor};
                         color:${inheritor.level==='国家级'?'var(--ink)':'white'};">
                ${inheritor.level}
            </span>
            <div class="inheritor-info">
                <div class="avatar avatar-md" style="cursor:pointer;"
                     onclick="openWorkshopInteraction(${inheritor.id})"
                     title="进入工坊研习">
                    ${inheritor.avatar}
                </div>
                <div>
                    <h3 class="inheritor-name">${inheritor.name}</h3>
                    <p class="inheritor-title">${inheritor.title}</p>
                    ${bondBadge}
                </div>
            </div>
            <div class="workshop-work-box">
                <div class="workshop-work-header">
                    <span class="workshop-work-name">虚实造物：${inheritor.workName}</span>
                    <span class="workshop-progress-label">研习进度：${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${progress}" style="width:0%;"></div>
                </div>
                <div style="font-size:11px;color:#888;margin-top:4px;">
                    已完成活动：${doneCount} / ${totalActs}
                </div>
            </div>
            <div class="workshop-actions">
                <button class="btn btn-sm btn-jade"
                        onclick="openWorkshopInteraction(${inheritor.id})">
                    研习技艺
                </button>
                <button class="btn btn-sm"
                        onclick="openInheritorStory(${inheritor.id})">
                    传承故事
                </button>
                <button class="btn btn-sm btn-outline"
                        onclick="_quickSendLetter('${inheritor.name.replace(/'/g,"\\'")}')">
                    🕊️ 传书
                </button>
                <button class="btn btn-sm ${canTransfer ? 'btn-outline' : 'btn-ghost'}"
                        onclick="${canTransfer
                            ? `openWorkshopInteraction(${inheritor.id},'product')`
                            : `showNotification('需研习进度100%方可解锁现世流转','🔒')`}"
                        ${!canTransfer ? 'disabled' : ''}>
                    ${canTransfer ? '📦 现世流转' : '🔒 未解锁'}
                </button>
            </div>
            ${bonusBadge}
        </div>`;
    };
})();

/* 快捷飞鸽传书 */
window._quickSendLetter = function(name) {
    if (typeof BondSystem === 'undefined') {
        showNotification('羁绊系统加载中…','⚠️'); return;
    }
    const lv = BondSystem.getLevel(name);
    if (lv.intimacy < 30) {
        showNotification(`与【${name}】的羁绊需达【相知】才可传书 (当前: ${lv.intimacy}/30)`, '🔒'); return;
    }
    const txt = prompt(`给【${name}】写一封信（将在数秒内收到回信）：`);
    if (txt && txt.trim()) BondSystem.sendLetter(name, txt.trim());
};


// ============================================================
// 二、天工阁顶部节气横幅 + 研习统计
// ============================================================
(function patchRenderWorkshop() {
    const origRender = window.renderWorkshop;
    window.renderWorkshop = function(category = 'all', customList = null) {
        _injectWorkshopHeader();
        if (origRender) origRender(category, customList);
        requestAnimationFrame(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = (bar.dataset.progress || 0) + '%';
            });
        });
    };
})();

function _injectWorkshopHeader() {
    const grid = document.getElementById('workshop-grid');
    if (!grid) return;
    let header = document.getElementById('workshop-enhanced-header');
    if (!header) {
        header = document.createElement('div');
        header.id = 'workshop-enhanced-header';
        grid.parentNode.insertBefore(header, grid);
    }

    if (typeof SolarTermEngine === 'undefined') { header.innerHTML = ''; return; }

    const term       = SolarTermEngine.getCurrentTerm();
    const next       = SolarTermEngine.getNextTerm();
    const days       = SolarTermEngine.getDaysUntilNext();
    const stats      = typeof XiuliluManager !== 'undefined' ? XiuliluManager.getStats() : {};
    const studyCount = (stats.study || 0) + (stats.craft || 0);

    header.style.cssText = 'margin-bottom:16px;';
    header.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:rgba(212,175,55,.06);border:1px solid rgba(212,175,55,.2);
                        border-radius:10px;padding:13px 16px;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">${term.icon}</span>
                <div>
                    <div style="font-size:13px;font-weight:bold;color:var(--gold);">
                        ${term.name} · 加成进行中
                    </div>
                    <div style="font-size:11px;color:#aaa;margin-top:2px;">
                        ${term.desc.slice(0,22)}…
                    </div>
                    <div style="font-size:11px;color:var(--jade);margin-top:2px;">
                        距 ${next.icon}${next.name} 还有 ${days} 天
                    </div>
                </div>
            </div>
            <div style="background:rgba(126,182,161,.06);border:1px solid rgba(126,182,161,.2);
                        border-radius:10px;padding:13px 16px;">
                <div style="font-size:12px;color:#888;margin-bottom:6px;">我的研习档案</div>
                <div style="font-size:20px;font-weight:bold;color:var(--amber);">
                    ${studyCount}
                    <span style="font-size:12px;font-weight:normal;color:#888;">次研习记录</span>
                </div>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button class="btn btn-sm" style="font-size:11px;padding:3px 10px;"
                            onclick="openXiulilu()">📖 传习录</button>
                    <button class="btn btn-sm" style="font-size:11px;padding:3px 10px;"
                            onclick="openOrders()">📦 我的订单</button>
                </div>
            </div>
        </div>`;
}


// ============================================================
// 三、B端控制台增强
// ============================================================
(function patchRenderInheritorDash() {
    const orig = window.renderInheritorDash;
    window.renderInheritorDash = function() {
        if (orig) orig();
        // 稍等 DOM 构建完成后再注入
        requestAnimationFrame(() => _injectBsideEnhancements());
    };
})();

function _injectBsideEnhancements() {
    // 节气横幅
    _injectBsideSolarBar();
    // 订单面板
    _injectBsideOrderPanel();
    // 批注入口
    _injectBsideAnnotationBtn();
}

/* 节气横幅 */
function _injectBsideSolarBar() {
    const dash = document.getElementById('view-inheritor-dash');
    if (!dash) return;
    let bar = document.getElementById('bside-solar-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'bside-solar-bar';
        bar.style.cssText = 'padding:0 20px 14px;flex-shrink:0;';
        const firstCard = dash.querySelector('.dash-card');
        if (firstCard) firstCard.parentNode.insertBefore(bar, firstCard);
        else dash.appendChild(bar);
    }
    bar.innerHTML = '<div id="bside-solar-widget"></div>';
    if (typeof SolarTermEngine !== 'undefined') {
        requestAnimationFrame(() => SolarTermEngine.renderCalendarWidget('bside-solar-widget'));
    }
}

/* 订单管理面板 */
function _injectBsideOrderPanel() {
    const grid = document.querySelector('.dash-grid');
    if (!grid || document.getElementById('bside-orders-card')) return;

    const card = document.createElement('div');
    card.id        = 'bside-orders-card';
    card.className = 'dash-card';
    card.style.cssText = 'grid-column:1/-1;';
    card.innerHTML = `
        <div class="dash-card-title"
             style="border-bottom-color:var(--jade);color:var(--jade);
                    display:flex;justify-content:space-between;align-items:center;">
            <span>📦 手信订单 · 现世流转管理</span>
            <button class="btn btn-sm" style="font-size:11px;padding:2px 10px;"
                    onclick="_refreshBsideOrders()">刷新</button>
        </div>
        <div id="bside-orders" style="margin-top:10px;max-height:260px;overflow-y:auto;"></div>`;
    grid.appendChild(card);
    _refreshBsideOrders();
}

window._refreshBsideOrders = function() {
    if (typeof O2OOrderManager !== 'undefined') {
        O2OOrderManager.renderBsidePending('bside-orders');
    } else {
        const el = document.getElementById('bside-orders');
        if (el) el.innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:16px;">
            订单系统加载中…</div>`;
    }
};

/* 批注入口按钮 */
function _injectBsideAnnotationBtn() {
    const grid = document.querySelector('.dash-grid');
    if (!grid || document.getElementById('bside-annotation-card')) return;

    const card = document.createElement('div');
    card.id        = 'bside-annotation-card';
    card.className = 'dash-card';
    card.innerHTML = `
        <div class="dash-card-title"
             style="border-bottom-color:var(--amber);color:var(--amber);">
            📝 传习批注 · 学徒档案点评
        </div>
        <p style="font-size:13px;color:#888;line-height:1.7;margin:12px 0;">
            学徒完成研习后，记录会进入传习录。<br>
            你可以在此为他们写下批注，批注将以金色字体展示在学徒的档案中。
        </p>
        <button class="btn btn-amber btn-full" style="font-size:13px;"
                onclick="openAnnotationPanel('bside-annotation-card')">
            📖 查看并批注学徒传习录
        </button>`;
    grid.appendChild(card);
}


// ============================================================
// 四、商店购买 O2O 自动建单
// ============================================================
(function patchBuyItem() {
    const origBuy = window.buyItem;
    window.buyItem = function(itemId) {
        // 调用原始购买逻辑
        if (origBuy) origBuy(itemId);

        // 找到商品数据
        const shopData = (typeof REGION_SHOPS !== 'undefined')
            ? (REGION_SHOPS[typeof currentShopRegion !== 'undefined' ? currentShopRegion : 'default'] || REGION_SHOPS['default'])
            : null;
        if (!shopData) return;

        const item = shopData.items.find(i => i.id === itemId);
        if (!item || item.stock < 0) return; // 已被原函数扣减

        // 仅对实体/预定商品自动创建 O2O 订单
        if ((item.o2oType === '实体' || item.o2oType === '预定') &&
            typeof O2OOrderManager !== 'undefined') {

            // 尝试匹配传承人
            let matchedInhId = null;
            if (typeof inheritorData !== 'undefined') {
                const inh = inheritorData.find(i =>
                    item.name.includes(i.name.slice(0,2)) ||
                    item.desc?.includes(i.name.slice(0,2))
                );
                if (inh) matchedInhId = inh.id;
            }

            O2OOrderManager.createOrder(
                matchedInhId,
                item.name,
                item.icon || '📦',
                item.o2oType,
                { inheritorName: matchedInhId ? null : '九州云商' }
            );
        }

        // 线上课程记入传习录
        if (item.o2oType === '线上' && typeof XiuliluManager !== 'undefined') {
            XiuliluManager.addEntry('study',
                `购买课程：${item.name}`,
                `已购买【${item.name}】，即时解锁。${item.desc}`,
                { itemGained: item.name }
            );
        }
    };
})();


// ============================================================
// 五、场景枢纽行动按钮全局注册
// ============================================================

/* 供 scenes.js action.func 字符串安全调用 */
window.handleAction = function(type, param) {
    switch (type) {
        case 'minigame':
            if (param === 'lianlv' && typeof openMinigame === 'function') openMinigame();
            else if (param === 'riddle' && typeof openRiddleGame === 'function') openRiddleGame();
            else showNotification(`进入【${param}】小游戏`, '🎮');
            break;
        case 'listen':
            _handleListenAction(param);
            break;
        case 'craft':
            if (typeof openCraftingHub === 'function') openCraftingHub();
            break;
        default:
            showNotification(`${type} · ${param}`, '✨');
    }
};

function _handleListenAction(sceneKey) {
    // 播放对应场景氛围
    const msgs = {
        wanyicheng: ['（台上青衣唱道：原来姹紫嫣红开遍，似这般都付与断井颓垣……）', '（锣鼓声远远传来，是《穆桂英挂帅》的片段）'],
        qinglanjie: ['（炭火燃着，壶里的水正咕噜咕噜响，茶香弥漫……）'],
        jinxiufang: ['（丝线穿越绢布时发出细微声响，周围寂静极了）'],
    };
    const pool = msgs[sceneKey] || ['（九州的声音悠远绵长，令人心旷神怡……）'];
    const text = pool[Math.floor(Math.random() * pool.length)];
    showNotification(text, '🎵', 6000);
    if (typeof XiuliluManager !== 'undefined') {
        XiuliluManager.addEntry('explore', '聆听非遗', text.replace(/[（）]/g,''),{});
    }
}


// ============================================================
// 六、传承人故事弹窗增强（加羁绊入口）
// ============================================================
(function patchOpenInheritorStory() {
    const orig = window.openInheritorStory;
    window.openInheritorStory = function(id) {
        if (orig) orig(id);
        // 在故事弹窗底部补充羁绊面板
        requestAnimationFrame(() => {
            const storyModal = document.getElementById('story-modal');
            if (!storyModal) return;
            const inh = typeof inheritorData !== 'undefined' ? inheritorData.find(i => i.id === id) : null;
            if (!inh) return;

            let bondPanel = storyModal.querySelector('#inline-bond-panel');
            if (!bondPanel) {
                bondPanel = document.createElement('div');
                bondPanel.id = 'inline-bond-panel';
                bondPanel.style.cssText = 'padding:16px 24px 0;border-top:1px dashed rgba(255,255,255,.1);margin-top:8px;';
                const content = storyModal.querySelector('.modal-content');
                if (content) content.appendChild(bondPanel);
            }
            if (typeof BondSystem !== 'undefined') {
                bondPanel.innerHTML = `<div style="font-size:13px;font-weight:bold;color:var(--amber);margin-bottom:10px;">与 ${inh.name} 的羁绊</div>`;
                BondSystem.renderPanel(inh.name, 'inline-bond-panel');
                // Re-render inside since renderPanel replaces innerHTML
                const wrap = document.createElement('div');
                wrap.innerHTML = `<div style="font-size:13px;font-weight:bold;color:var(--amber);margin-bottom:10px;">💛 与 ${inh.name} 的羁绊</div>`;
                const innerDiv = document.createElement('div');
                innerDiv.id = 'story-bond-inner';
                wrap.appendChild(innerDiv);
                bondPanel.innerHTML = '';
                bondPanel.appendChild(wrap);
                BondSystem.renderPanel(inh.name, 'story-bond-inner');
            }
        });
    };
})();
