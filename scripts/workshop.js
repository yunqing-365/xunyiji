/**
 * workshop.js
 * 寻遗集 · 天工阁模块
 * 负责：匠师数据管理 / 卡片渲染 / 传承人中控台 / O2O商铺 / 残谱任务分发
 */

// ============================================================
// 一、天工阁基础渲染 (C端玩家看的部分)
// ============================================================
let _currentWorkshopCategory = 'all';

function filterWorkshop(category) {
    _currentWorkshopCategory = category;
    document.querySelectorAll('#view-workshop .filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    renderWorkshop(category);
}

function renderWorkshop(category = 'all', customList = null) {
    const grid = document.getElementById('workshop-grid');
    if (!grid) return;

    const list = customList ?? (category === 'all' ? inheritorData : inheritorData.filter(item => item.category === category));

    if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px; color:#aaa;"><div style="font-size:48px; margin-bottom:15px;">🔍</div><p>暂无符合条件的匠师</p></div>`;
        return;
    }

    grid.innerHTML = list.map((inheritor, idx) => _buildInheritorCard(inheritor, idx)).join('');

    requestAnimationFrame(() => {
        grid.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.dataset.progress + '%';
        });
    });
}

function _buildInheritorCard(inheritor, idx) {
    const levelColor = inheritor.level === '国家级' ? 'var(--gold)' : 'var(--jade)';
    const canTransfer = inheritor.progress >= 100;
    return `
        <div class="workshop-card scroll-reveal" style="animation-delay:${idx * 0.06}s;">
            <span class="workshop-level-badge" style="background:${levelColor}; color:${inheritor.level === '国家级' ? 'var(--ink)' : 'white'};">${inheritor.level}</span>
            <div class="inheritor-info">
                <div class="avatar avatar-md">${inheritor.avatar}</div>
                <div><h3 class="inheritor-name">${inheritor.name}</h3><p class="inheritor-title">${inheritor.title}</p></div>
            </div>
            <div class="workshop-work-box">
                <div class="workshop-work-header">
                    <span class="workshop-work-name">虚实造物：${inheritor.workName}</span>
                    <span class="workshop-progress-label">研习进度：${inheritor.progress}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" data-progress="${inheritor.progress}" style="width:0%;"></div></div>
            </div>
            <div class="workshop-actions">
                <button class="btn btn-sm" onclick="showNotification('研习模块即将开放', '🛠️')">研习技艺</button>
                <button class="btn btn-sm" onclick="openInheritorStory(${inheritor.id})">传承故事</button>
                <button class="btn btn-sm btn-outline" onclick="showNotification('已提交拜师申请！', '📜')">拜师学艺</button>
                <button class="btn btn-sm ${canTransfer ? 'btn-outline' : 'btn-ghost'}" onclick="${canTransfer ? `showNotification('流转契约已生成', '📦')` : `showNotification('需研习进度100%方可解锁', '🔒')`}" ${!canTransfer ? 'disabled' : ''}>${canTransfer ? '现世流转' : '未解锁'}</button>
            </div>
        </div>
    `;
}

function openInheritorStory(id) {
    const inheritor = inheritorData.find(i => i.id === id);
    if (!inheritor) return;
    if (typeof openStoryModal === 'function') {
        openStoryModal(inheritor.name, inheritor.title, inheritor.story);
    }
}

// ============================================================
// 二、传承人中控台 (B端匠师看的部分)
// ============================================================

const inheritorState = {
    region: 'baizuozhen',
    pos: { x: 1200, y: 800 }, 
    pigeonMails: [
        { id: 1, from: '游历者·星渊', content: '师傅，您昨天发布的残谱太难了，我跑遍了青岚界都没找到晨露，能给点提示吗？', status: 'unread' }
    ],
    submittedItems: [
        { id: 101, playerName: '云客', taskName: '门派历练', itemName: '青釉茶盏', desc: '弟子按图索骥烧制出此盏，请师傅品鉴赐字。' }
    ],
    o2oListings: [
        { id: 201, type: '实体', name: '大师亲制·西施紫砂壶', stock: 2, price: '800灵石' },
        { id: 204, type: '线上', name: '【录播】十二生肖剪纸技法精讲', stock: 999, price: '50灵石' }
    ],
    publishedQuests: [],
    orders: []
};

function _generateItemOptions(filterType = 'all') {
    let options = '<option value="">-- 请选择九州灵物 --</option>';
    if (typeof itemDatabase !== 'undefined') {
        for (let [name, data] of Object.entries(itemDatabase)) {
            if (filterType === 'all' || data.type === filterType || (filterType === 'material' && data.type === 'prop')) {
                options += `<option value="${name}">${data.icon} ${name} (稀有度:${data.rarity})</option>`;
            }
        }
    }
    return options;
}

function _syncGlobalInheritorData() {
    const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';
    if (typeof gameState !== 'undefined') {
        if (!gameState.globalInheritorData) gameState.globalInheritorData = {};
        if (!gameState.globalInheritorData[currentName]) gameState.globalInheritorData[currentName] = {};
        gameState.globalInheritorData[currentName].region = inheritorState.region;
        gameState.globalInheritorData[currentName].pos = inheritorState.pos; 
        gameState.globalInheritorData[currentName].quests = inheritorState.publishedQuests;
        if (typeof SaveManager !== 'undefined') SaveManager.save();
    }
}

function _ensureInheritorModals() {
    if (document.getElementById('modal-reply-mail')) return;

    const modalsHTML = `
        <div id="modal-reply-mail" class="modal" style="width: 550px; background: #fdfbf7; background-image: var(--texture-paper);">
            <div class="modal-header modal-header-jade" style="border-bottom: 2px solid var(--gold);">
                <h3 id="reply-mail-title">飞鸽传书 · 见字如面</h3>
                <button class="modal-close" onclick="closeModal('modal-reply-mail')">×</button>
            </div>
            <div class="modal-content" style="padding: 30px;">
                <input type="hidden" id="reply-mail-id"><input type="hidden" id="reply-mail-player">
                <div style="background: rgba(126,182,161,0.05); border-left: 4px solid var(--jade); padding: 15px; margin-bottom: 20px; font-size: 13px; color: #555; font-style: italic;" id="reply-mail-context">读取信件内容...</div>
                <textarea id="reply-mail-content" placeholder="提笔写下你的指导与寄语..." style="width:100%; height:150px; padding:15px; border:1px dashed var(--jade); background:transparent; border-radius:8px; resize:none; font-family:var(--font-kai); font-size:16px; line-height:1.8; margin-bottom:20px; outline:none; box-shadow:inset 0 0 10px rgba(0,0,0,0.02);"></textarea>
                <div style="margin-bottom: 25px; background:white; padding:15px; border-radius:8px; border:1px solid #eee;">
                    <label style="font-size:13px; color:var(--ink); font-weight:bold; display:block; margin-bottom:8px;">🎁 随信附赠门派信物：</label>
                    <select id="reply-mail-gift" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--gold); outline:none; font-family:inherit; font-size:14px; background:#fafaf8;">${_generateItemOptions('material')}</select>
                </div>
                <button class="btn btn-jade btn-full" style="font-size:16px; padding:14px;" onclick="submitReplyMail()">🕊️ 封缄 · 放飞信鸽</button>
            </div>
        </div>

        <div id="modal-publish-quest" class="modal" style="width: 550px; border: 2px solid var(--gold);">
            <div class="modal-header modal-header-gold">
                <h3>📜 拟定门派残谱 (挂载至驻地 NPC)</h3>
                <button class="modal-close" onclick="closeModal('modal-publish-quest')">×</button>
            </div>
            <div class="modal-content" style="padding: 30px;">
                <p style="font-size:13px; color:#666; margin-bottom:20px; line-height:1.6;">拟定后，任务将挂载到您驻地的化身(NPC)上。玩家须亲自探索找到您才能接取此悬赏。</p>
                <div style="margin-bottom:20px;">
                    <label style="font-size:13px; color:var(--ink); font-weight:bold;">任务卷轴名称：</label>
                    <input type="text" id="quest-name" placeholder="例如：寻梦冰裂纹" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; outline:none; margin-top:8px; font-size:14px;">
                </div>
                <div style="margin-bottom:25px; background:rgba(212,175,55,0.08); padding:20px; border-radius:12px; border:1px dashed var(--gold);">
                    <div style="font-size:13px; color:var(--ink); font-weight:bold; margin-bottom:12px;">要求玩家搜集以下灵物：</div>
                    <select id="quest-mat-1" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--gold); margin-bottom:12px; font-family:inherit; font-size:14px;">${_generateItemOptions('material')}</select>
                    <select id="quest-mat-2" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--gold); font-family:inherit; font-size:14px;">${_generateItemOptions('material')}</select>
                </div>
                <button class="btn btn-gold btn-full" style="font-size:16px; padding:14px; letter-spacing:1px;" onclick="submitPublishQuest()">✨ 盖上掌门大印 · 挂载至分身</button>
            </div>
        </div>

        <div id="modal-consecrate" class="modal" style="width: 480px; background: linear-gradient(180deg, #2c2a28, #1a1816); color: #e8dcc8; border: 1px solid var(--gold);">
            <div class="modal-header" style="background: transparent; border-bottom: 1px dashed rgba(212,175,55,0.4);">
                <h3 style="color:var(--gold);">✨ 呈交品鉴与开光赐字</h3>
                <button class="modal-close" style="color:#aaa;" onclick="closeModal('modal-consecrate')">×</button>
            </div>
            <div class="modal-content text-center" style="padding: 40px 30px;">
                <div style="position:relative; width:100px; height:100px; margin:0 auto 20px;">
                    <div style="position:absolute; inset:0; border-radius:50%; background:radial-gradient(circle, rgba(212,175,55,0.4), transparent); animation:pulse 2s infinite;"></div>
                    <div id="consecrate-icon" style="font-size:65px; position:relative; z-index:1; animation: float 3s infinite; text-shadow:0 10px 20px rgba(0,0,0,0.5);">📦</div>
                </div>
                <h4 id="consecrate-item-name" style="color:var(--gold); font-size:22px; margin-bottom:8px; font-family:var(--font-kai); letter-spacing:2px;">物品</h4>
                <p id="consecrate-player-name" style="font-size:13px; color:#aaa; margin-bottom:30px;">造物门徒：未知</p>
                <div style="text-align:left; margin-bottom:25px; background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; border:1px solid #333;">
                    <label style="font-size:13px; color:#ccc; font-weight:bold;">赐予此物独一无二的【前缀/题字】：</label>
                    <input type="text" id="consecrate-prefix" value="匠心亲传·" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--gold); background:#111; color:var(--gold); font-weight:bold; font-size:15px; outline:none; margin-top:12px; font-family:inherit;">
                </div>
                <input type="hidden" id="consecrate-id">
                <button class="btn btn-gold btn-full" style="font-size:16px; padding:15px; box-shadow:0 0 20px rgba(212,175,55,0.3);" onclick="submitConsecrate()">注入百年匠心 · 落印开光</button>
            </div>
        </div>

        <div id="modal-add-o2o" class="modal" style="width: 500px;">
            <div class="modal-header modal-header-amber">
                <h3>🏬 九州商行 · 现世流转上架</h3>
                <button class="modal-close" onclick="closeModal('modal-add-o2o')">×</button>
            </div>
            <div class="modal-content" style="padding: 30px;">
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px; color:var(--ink); font-weight:bold;">流转类型：</label>
                    <select id="o2o-type" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; margin-top:6px; outline:none;">
                        <option value="实体">📦 实体手工艺品 (实物直邮)</option>
                        <option value="线下">📍 线下非遗体验 (门店核销)</option>
                        <option value="线上">💻 线上录播课 (即买即看)</option>
                        <option value="藏品">💎 Web3数字藏品 (链上凭证)</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px; color:var(--ink); font-weight:bold;">商品标题：</label>
                    <input type="text" id="o2o-name" placeholder="例如：周末苏绣入门大师课" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; margin-top:6px; outline:none;">
                </div>
                <div style="display:flex; gap:15px; margin-bottom:25px;">
                    <div style="flex:1;"><label style="font-size:12px; color:var(--ink); font-weight:bold;">售价：</label><input type="text" id="o2o-price" placeholder="例如：500灵石" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; margin-top:6px; outline:none;"></div>
                    <div style="flex:1;"><label style="font-size:12px; color:var(--ink); font-weight:bold;">库存：</label><input type="number" id="o2o-stock" value="99" style="width:100%; padding:12px; border-radius:8px; border:1px solid #ccc; margin-top:6px; outline:none;"></div>
                </div>
                <button class="btn btn-amber btn-full" style="font-size:16px; padding:14px;" onclick="submitAddO2O()">✅ 确认无误，挂牌上架</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

window.updateInheritorRegion = function(regionKey) {
    inheritorState.region = regionKey;
    _syncGlobalInheritorData();
    showNotification('门派大区已迁移！请在下方微缩地图点击设置精确位置。', '📍');
    if (typeof playSound === 'function') playSound('click');
};

window.pickInheritorLocation = function(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pctX = (event.clientX - rect.left) / rect.width;
    const pctY = (event.clientY - rect.top) / rect.height;

    const mapW = 2800, mapH = 1800;
    const realX = Math.floor(pctX * mapW);
    const realY = Math.floor(pctY * mapH);

    inheritorState.pos = { x: realX, y: realY };

    const pin = document.getElementById('inh-map-pin');
    if (pin) {
        pin.style.left = (pctX * 100) + '%';
        pin.style.top = (pctY * 100) + '%';
    }
    document.getElementById('pos-x-disp').innerText = realX;
    document.getElementById('pos-y-disp').innerText = realY;

    _syncGlobalInheritorData();
    if (typeof playSound === 'function') playSound('magic');
    showNotification(`化身已精准落位于 X:${realX}, Y:${realY}`, '🎯');
};

window.renderInheritorDash = function() {
    const container = document.getElementById('inheritor-dash-content');
    if (!container) return;

    _ensureInheritorModals();
    _syncGlobalInheritorData();

    let locationHTML = `
        <div class="dash-card" style="grid-column: 1 / -1; background: linear-gradient(to right, #fdfaf4, white); border-left: 5px solid var(--amber);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                <div>
                    <div style="font-size:16px; font-weight:bold; color:var(--ink); margin-bottom:4px;">📍 门派工坊驻扎地 (全九州精准布点)</div>
                    <div style="font-size:12px; color:#888;">选择大区后，请在下方微缩地图上点击，<strong style="color:var(--cinnabar);">精确放置</strong>您的化身位置。</div>
                </div>
                <select id="inh-region-select" style="padding:10px 20px; border-radius:8px; border:2px solid var(--amber); outline:none; font-weight:bold; color:var(--amber); font-family:inherit; cursor:pointer;" onchange="updateInheritorRegion(this.value)">
                    <optgroup label="国风核心区">
                        <option value="wanyicheng" ${inheritorState.region==='wanyicheng'?'selected':''}>🏮 万艺城</option>
                        <option value="baiweixiang" ${inheritorState.region==='baiweixiang'?'selected':''}>🍡 百味巷</option>
                        <option value="qinglanjie" ${inheritorState.region==='qinglanjie'?'selected':''}>🍵 青岚界</option>
                        <option value="baizuozhen" ${inheritorState.region==='baizuozhen'?'selected':''}>⚒️ 百作镇</option>
                        <option value="jinxiufang" ${inheritorState.region==='jinxiufang'?'selected':''}>👘 锦绣坊</option>
                        <option value="tongxiyu" ${inheritorState.region==='tongxiyu'?'selected':''}>🐪 通西域</option>
                        <option value="yuanjingdu" ${inheritorState.region==='yuanjingdu'?'selected':''}>🏙️ 元境都</option>
                        <option value="wanxiangtai" ${inheritorState.region==='wanxiangtai'?'selected':''}>🪁 万象台</option>
                    </optgroup>
                    <optgroup label="异域探索区">
                        <option value="ouluoba" ${inheritorState.region==='ouluoba'?'selected':''}>🏰 欧罗巴古堡</option>
                        <option value="midianzhijing" ${inheritorState.region==='midianzhijing'?'selected':''}>🔮 秘典之境</option>
                        <option value="cangminghai" ${inheritorState.region==='cangminghai'?'selected':''}>🧜‍♀️ 沧溟海域</option>
                        <option value="fukongyunjing" ${inheritorState.region==='fukongyunjing'?'selected':''}>☁️ 浮空云境</option>
                        <option value="shahaiyicheng" ${inheritorState.region==='shahaiyicheng'?'selected':''}>🏜️ 沙海遗城</option>
                        <option value="senzhidiyu" ${inheritorState.region==='senzhidiyu'?'selected':''}>🧚 森之低语</option>
                    </optgroup>
                </select>
            </div>
            
            <div id="inh-map-picker" style="position:relative; width:100%; height:160px; background:#e0ece4; background-image:radial-gradient(#7eb6a1 1px, transparent 1px); background-size:20px 20px; border-radius:12px; border:2px dashed var(--jade); cursor:crosshair; overflow:hidden;" onclick="pickInheritorLocation(event)">
                <div style="position:absolute; top:8px; left:12px; font-size:12px; color:var(--jade); font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 8px; border-radius:4px;">雷达拓扑图 (点击地图任意处落子)</div>
                <div id="inh-map-pin" style="position:absolute; width:30px; height:30px; background:var(--cinnabar); border:2px solid white; border-radius:50%; transform:translate(-50%, -100%); top:${(inheritorState.pos.y / 1800)*100}%; left:${(inheritorState.pos.x / 2800)*100}%; box-shadow:0 10px 15px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:white; font-size:14px; transition: top 0.3s ease, left 0.3s ease;">📍</div>
            </div>
            <div style="text-align:right; font-size:12px; color:#888; margin-top:8px;">当前坐标: X:<span id="pos-x-disp" style="font-weight:bold; color:var(--ink);">${inheritorState.pos.x}</span>, Y:<span id="pos-y-disp" style="font-weight:bold; color:var(--ink);">${inheritorState.pos.y}</span></div>
        </div>
    `;

    let mailsHTML = inheritorState.pigeonMails.map(m => `
        <div class="dash-list-item" style="border-left: 3px solid ${m.status==='unread' ? 'var(--cinnabar)' : '#ccc'}; flex-direction:column; align-items:flex-start; gap:10px;">
            <div style="width:100%;"><div style="font-weight:bold; font-size:13px; color:var(--ink);">🕊️ 来自：${m.from}</div><div style="font-size:12px; color:#666; margin-top:6px;">"${m.content}"</div></div>
            ${m.status === 'unread' ? `<button class="btn btn-sm btn-outline" style="border-color:var(--cinnabar); color:var(--cinnabar); align-self:flex-end;" onclick="openReplyMail(${m.id}, '${m.from}')">回信赐礼</button>` : `<span style="color:#aaa; font-size:12px; align-self:flex-end;">已亲自回信</span>`}
        </div>
    `).join('');

    let tasksHTML = `
        <div style="margin-bottom:15px; padding:15px; background:rgba(126,182,161,0.08); border:1px dashed var(--jade); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div><div style="font-size:14px; font-weight:bold; color:var(--jade);">📜 拟定残谱任务</div><div style="font-size:11px; color:#666; margin-top:4px;">当前挂载残谱：${inheritorState.publishedQuests.length} 卷</div></div>
            <button class="btn btn-sm btn-jade" onclick="openModal('modal-publish-quest')">拟定残谱</button>
        </div>
        <div style="font-size:13px; font-weight:bold; margin-bottom:10px; color:var(--ink);">🙏 门徒呈交 (待品鉴开光)</div>
    `;
    tasksHTML += inheritorState.submittedItems.length > 0 ? inheritorState.submittedItems.map(item => `
        <div class="dash-list-item" style="flex-direction:column; align-items:flex-start; gap:10px; border-left:3px solid var(--gold);">
            <div style="width:100%;"><div style="font-weight:bold; font-size:13px; color:var(--ink);">📦 呈交物：${item.itemName}</div><div style="font-size:12px; color:var(--amber); margin-top:4px;">造物者：${item.playerName} <span style="color:#888;">(${item.taskName})</span></div><div style="font-size:11px; color:#888; margin-top:4px; font-style:italic;">"${item.desc}"</div></div>
            <button class="btn btn-sm btn-gold" style="align-self:flex-end; box-shadow:0 2px 8px rgba(212,175,55,0.3);" onclick="openConsecrate(${item.id}, '${item.playerName}', '${item.itemName}')">✨ 品鉴开光</button>
        </div>
    `).join('') : '<div style="color:#aaa; font-size:12px; text-align:center; padding:10px;">暂无弟子呈交作品</div>';

    let o2oHTML = inheritorState.o2oListings.map(listing => {
        let c = {'实体':'var(--cinnabar)','线下':'var(--jade)','线上':'#4a90e2','藏品':'var(--purple)'}[listing.type] || '#333';
        let bg = {'实体':'#fde8e8','线下':'#e8f4ef','线上':'#e6f0fa','藏品':'#f0ebf6'}[listing.type] || '#eee';
        return `<div class="dash-list-item" style="padding:12px 15px;"><div style="display:flex; gap:10px; align-items:center;"><span style="font-size:11px; font-weight:bold; padding:4px 8px; border-radius:4px; background:${bg}; color:${c};">${listing.type}</span><div><div style="font-weight:bold; font-size:13px; color:var(--ink);">${listing.name}</div><div style="font-size:11px; color:#888; margin-top:5px;">库存: ${listing.stock} | 售价: ${listing.price}</div></div></div></div>`;
    }).join('');
    
    // 🌟 核心修复 1：变量名修正，避免 ReferenceError 崩溃
    const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';

    const customAI = (gameState.customAI && gameState.customAI[currentName]) ? gameState.customAI[currentName] : { personality: '', knowledge: '' };
    let aiConfigHTML = `
        <div class="dash-card" style="grid-column: 1 / -1; border: 2px solid var(--gold); background: linear-gradient(180deg, #fdfbf7, white);">
            <div class="dash-card-title" style="color:var(--gold); border-bottom-color:var(--gold); display:flex; justify-content:space-between; align-items:center;">
                <span>🧠 灵识培养与数字确权</span>
                <span style="font-size:13px; color:var(--jade); cursor:pointer; text-decoration:underline;" onclick="openWeb3History()">📜 查看上链历史</span>
            </div>
            <div style="display:flex; gap:20px; margin-bottom: 15px;">
                <div style="flex:1;"><div style="font-size:12px; font-weight:bold; margin-bottom:5px;">🎭 设定分身性格：</div><textarea id="ai-custom-personality" style="width:100%; height:80px; padding:12px; border-radius:8px; border:1px solid #ccc; resize:none; font-family:inherit; outline:none;">${customAI.personality}</textarea></div>
                <div style="flex:2;"><div style="font-size:12px; font-weight:bold; margin-bottom:5px;">📜 注入核心技艺：</div><textarea id="ai-custom-knowledge" style="width:100%; height:80px; padding:12px; border-radius:8px; border:1px solid #ccc; resize:none; font-family:inherit; outline:none;">${customAI.knowledge}</textarea></div>
            </div>
            <div style="padding: 20px; border: 2px dashed var(--gold); border-radius: 12px; background: rgba(212, 175, 55, 0.05); text-align: center;">
                <div style="font-size:30px; margin-bottom:10px;">📄</div><div style="font-size:14px; font-weight:bold;">上传非遗典籍文件</div>
                <input type="file" id="ai-custom-file" accept=".pdf,.doc,.docx,.txt" style="margin-top:15px; font-size:12px;">
                <div id="blockchain-result-mini" style="display:none; margin-top:15px; padding:12px; background:rgba(0,255,170,0.1); border-radius:8px; font-size:12px; text-align:left; border-left:4px solid #00ffaa;">
                    <div style="color:#008855; font-weight:bold;">✅ 确权成功！</div><div style="color:#666;">区块高度：<span id="mini-block-num" style="color:var(--gold);"></span></div><div style="color:#666; font-family:monospace; font-size:11px;">Hash: <span id="mini-hash"></span></div>
                </div>
            </div>
            <button id="btn-sync-chain" class="btn btn-gold" style="margin-top:15px; width:100%; font-size:16px; padding:14px;" onclick="syncSoulAndChain()">✨ 注入灵识 · 链上确权</button>
        </div>
    `;

    container.innerHTML = `
        <div class="dash-grid">
            ${locationHTML}
            <div class="dash-card"><div class="dash-card-title">💌 飞鸽驿站</div><div style="display:flex; flex-direction:column; gap:12px; max-height:350px; overflow-y:auto;">${mailsHTML}</div></div>
            <div class="dash-card"><div class="dash-card-title">⛩️ 传承道场</div><div style="display:flex; flex-direction:column; gap:12px; max-height:350px; overflow-y:auto;">${tasksHTML}</div></div>
            <div class="dash-card" style="grid-column: 1 / -1;"><div class="dash-card-title" style="border-bottom-color:var(--amber); color:var(--amber); display:flex; justify-content:space-between;"><span>🏬 O2O 现世流转 (商铺管理)</span><button class="btn btn-sm btn-amber" style="padding:2px 10px;" onclick="openModal('modal-add-o2o')">➕ 上架商品/课程</button></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">${o2oHTML}</div></div>
            ${aiConfigHTML}
        </div>
    `;
};

// ============================================================
// 三、交互逻辑
// ============================================================

window.openReplyMail = function(mailId, playerName) {
    const mail = inheritorState.pigeonMails.find(m => m.id === mailId);
    document.getElementById('reply-mail-id').value = mailId;
    document.getElementById('reply-mail-player').value = playerName;
    document.getElementById('reply-mail-context').innerText = `游历者来信：${mail.content}`;
    document.getElementById('reply-mail-content').value = '';
    document.getElementById('reply-mail-gift').value = '';
    openModal('modal-reply-mail');
};

window.submitReplyMail = function() {
    const mailId = parseInt(document.getElementById('reply-mail-id').value);
    const content = document.getElementById('reply-mail-content').value.trim();
    const giftName = document.getElementById('reply-mail-gift').value;

    if (!content) { showNotification('信件内容不可为空', '⚠️'); return; }
    const mail = inheritorState.pigeonMails.find(m => m.id === mailId);
    if (mail) mail.status = 'read';

    if (giftName && typeof addItem === 'function') {
        addItem(giftName, 1);
        showNotification(`信件已发出！信物【${giftName}】已直接发往玩家行囊！`, '🕊️');
    } else {
        showNotification(`信件已化作飞鸽传往大世界！`, '🕊️');
    }
    if(typeof playSound === 'function') playSound('magic');
    closeModal('modal-reply-mail');
    renderInheritorDash(); 
};

window.submitPublishQuest = function() {
    const name = document.getElementById('quest-name').value.trim();
    const mat1 = document.getElementById('quest-mat-1').value;
    const mat2 = document.getElementById('quest-mat-2').value;

    if (!name || !mat1 || !mat2) { showNotification('请完整填写残谱与所需材料', '⚠️'); return; }

    const newQuest = { id: 'custom_quest_' + Date.now(), name: name, mat1: mat1, mat2: mat2 };
    inheritorState.publishedQuests.push(newQuest);
    _syncGlobalInheritorData();

    showNotification(`残谱《${name}》已挂载至您的化身，等待有缘人拜访领取！`, '📜', 5000);
    if(typeof playSound === 'function') playSound('achievement');
    closeModal('modal-publish-quest');
    renderInheritorDash(); 
};

window.openConsecrate = function(submitId, playerName, itemName) {
    document.getElementById('consecrate-id').value = submitId;
    document.getElementById('consecrate-item-name').innerText = itemName;
    document.getElementById('consecrate-player-name').innerText = `造物门徒：${playerName}`;
    let icon = '📦';
    if (typeof itemDatabase !== 'undefined' && itemDatabase[itemName]) { icon = itemDatabase[itemName].icon; }
    document.getElementById('consecrate-icon').innerText = icon;
    openModal('modal-consecrate');
};

window.submitConsecrate = function() {
    const submitId = parseInt(document.getElementById('consecrate-id').value);
    const prefix = document.getElementById('consecrate-prefix').value.trim();
    const originalItemName = document.getElementById('consecrate-item-name').innerText;
    
    if (!prefix) { showNotification('请赐予名字前缀', '⚠️'); return; }
    inheritorState.submittedItems = inheritorState.submittedItems.filter(x => x.id !== submitId);
    
    const newItemName = `${prefix}${originalItemName}`;
    if (typeof itemDatabase !== 'undefined') {
        const baseData = itemDatabase[originalItemName] || { icon: '✨', type: 'prop' };
        itemDatabase[newItemName] = {
            icon: baseData.icon, type: 'rare', rarity: 5,
            desc: `得匠师赐字开光，已化为绝品。`,
            echo: `“吾徒心诚，特赐此名。”`,
            usable: true, actionName: '前往化身纪佩戴'
        };
        if (typeof addItem === 'function') addItem(newItemName, 1);
    }
    
    showNotification(`开光成功！绝品【${newItemName}】已发给玩家！`, '🌟', 4000);
    if(typeof playSound === 'function') playSound('magic');
    closeModal('modal-consecrate');
    renderInheritorDash();
};

window.submitAddO2O = function() {
    const type = document.getElementById('o2o-type').value;
    const name = document.getElementById('o2o-name').value.trim();
    const priceStr = document.getElementById('o2o-price').value.trim();
    const stock = parseInt(document.getElementById('o2o-stock').value);

    if (!name || !priceStr || isNaN(stock)) { showNotification('请完整填写商铺信息', '⚠️'); return; }
    inheritorState.o2oListings.unshift({ id: Date.now(), type, name, stock, price: priceStr });

    if (typeof REGION_SHOPS !== 'undefined' && REGION_SHOPS['default']) {
        let iconMap = { '实体':'📦', '线下':'📍', '线上':'💻', '藏品':'💎' };
        REGION_SHOPS['default'].items.unshift({
            id: 'o2o_' + Date.now(), name: `[${type}] ${name}`,
            cat: type === '实体' ? 'prop' : 'collection',
            price: parseInt(priceStr) || 999, stock: stock, icon: iconMap[type], desc: `匠师直供的${type}体验`
        });
    }
    showNotification(`【${type}】${name} 已成功挂牌商行！`, '🏬', 4000);
    if(typeof playSound === 'function') playSound('checkin');
    closeModal('modal-add-o2o');
    renderInheritorDash();
};

window.shipOrder = function(id) {
    const o = inheritorState.orders.find(x => x.id === id);
    if (!o) return;
    o.status = 'shipped';
    showNotification(`【${o.item}】核销成功！玩家可在订单中心查收。`, '✅');
    if (typeof playSound === 'function') playSound('achievement');
    renderInheritorDash();
};

// ============================================================
// 四、AI与区块链引擎 (带完整防错)
// ============================================================

// 🌟 补全丢失的上链历史查看功能
window.openWeb3Console = function(inheritorName = "未知匠师") {
    document.getElementById('web3-console')?.remove();

    const panel = document.createElement('div');
    panel.id = 'web3-console';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:600px; height:450px; background:linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98)); border:1px solid var(--gold); border-radius:12px; box-shadow: 0 0 30px rgba(212,175,55,0.2), inset 0 0 15px rgba(212,175,55,0.1); z-index:3000; color:#e8dcc8; display:flex; flex-direction:column; overflow:hidden;`;

    panel.innerHTML = `
        <div style="padding:20px 30px; border-bottom:1px solid rgba(212,175,55,0.3); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3);">
            <div style="display:flex; gap:20px;">
                <button id="tab-history" style="background:none; border:none; color:var(--gold); font-size:18px; font-weight:bold; cursor:pointer; padding-bottom:5px; border-bottom:2px solid var(--gold);">📜 链上确权资产历史</button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#aaa; font-size:24px; cursor:pointer;">×</button>
        </div>
        <div id="panel-history" style="padding:30px; flex:1; overflow-y:auto;">
            <div id="history-loading" style="text-align:center; color:var(--gold); padding:40px;">
                <div class="anim-blink">🔄 正在与区块链节点同步数据...</div>
            </div>
            <div id="history-list" style="display:flex; flex-direction:column; gap:15px;"></div>
        </div>
    `;

    document.body.appendChild(panel);

    const loadHistory = async () => {
        const listDiv = document.getElementById('history-list');
        const loadingDiv = document.getElementById('history-loading');
        try {
            const response = await fetch(`http://localhost:3000/api/knowledge-history?inheritorName=${encodeURIComponent(inheritorName)}`);
            const data = await response.json();
            loadingDiv.style.display = 'none';

            if (!data.success) throw new Error(data.error);
            if (data.history.length === 0) {
                listDiv.innerHTML = `<div style="text-align:center; color:#888; padding:30px;">暂无上链的确权资产。</div>`;
                return;
            }

            data.history.forEach(item => {
                const dateStr = new Date(item.timestamp).toLocaleString();
                const card = document.createElement('div');
                card.style.cssText = `background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.2); border-radius:8px; padding:15px; position:relative;`;
                card.innerHTML = `
                    <div style="position:absolute; top:0; right:0; background:rgba(212,175,55,0.2); color:var(--gold); padding:2px 10px; font-size:11px; border-bottom-left-radius:8px;">已确权</div>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;"><span style="font-size:20px;">📄</span><span style="font-weight:bold; color:#e8dcc8; font-size:15px;">${item.fileName}</span></div>
                    <div style="font-size:12px; color:#aaa; margin-bottom:6px;"><span style="color:#888;">确权时间：</span>${dateStr}</div>
                    <div style="font-size:11px; color:#aaa; word-break:break-all; background:rgba(0,0,0,0.4); padding:8px; border-radius:4px; font-family:monospace;"><span style="color:#888;">文件数字指纹 (Hash):</span><br>${item.documentHash}</div>
                `;
                listDiv.appendChild(card);
            });
        } catch (err) {
            loadingDiv.innerHTML = `<span style="color:#ff4444;">❌ 拉取失败: 请确保 Node 服务器已启动</span>`;
        }
    };
    loadHistory();
};

window.syncSoulAndChain = async function() {
    try {
        const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';
        const personalityInput = document.getElementById('ai-custom-personality');
        const knowledgeInput = document.getElementById('ai-custom-knowledge');
        const fileInput = document.getElementById('ai-custom-file');
        const btn = document.getElementById('btn-sync-chain');

        const personality = personalityInput ? personalityInput.value.trim() : '严谨的传承人';
        let knowledgeText = knowledgeInput ? knowledgeInput.value.trim() : '技艺精湛，但不善言辞。';

        if (!btn) return;
        btn.disabled = true;
        btn.innerHTML = '<span class="anim-blink">正在沟通九州天道...</span>';
        btn.style.filter = 'grayscale(1)';

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            knowledgeText += `\n[系统注：大模型已读取典籍《${file.name}》的内容]`;

            const uploadPromise = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const response = await fetch('http://localhost:3000/api/register-knowledge', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ inheritorName: currentName, fileName: file.name, fileContent: e.target.result })
                        });
                        const resData = await response.json();
                        if (resData.success) resolve(resData);
                        else reject(resData.error || '后端返回失败状态');
                    } catch (fetchErr) {
                        reject('后端服务未启动或连接被拒绝');
                    }
                };
                reader.onerror = () => reject('浏览器文件读取失败');
                reader.readAsDataURL(file);
            });

            const chainResult = await uploadPromise;
            
            const miniResult = document.getElementById('blockchain-result-mini');
            if(miniResult) {
                miniResult.style.display = 'block';
                document.getElementById('mini-block-num').innerText = `#${chainResult.blockNumber}`;
                document.getElementById('mini-hash').innerText = chainResult.documentHash.substring(0, 30) + '...';
            }
            if (typeof playSound === 'function') playSound('achievement');
            if (typeof showNotification === 'function') showNotification(`《${file.name}》已铸造为区块链数字资产！`, '⛓️');
            
        } else {
            if (typeof playSound === 'function') playSound('magic');
            if (typeof showNotification === 'function') showNotification('AI 分身认知已更新！', '🧠');
        }

        if (typeof gameState !== 'undefined') {
            if (!gameState.customAI) gameState.customAI = {};
            gameState.customAI[currentName] = { personality: personality, knowledge: knowledgeText };
            if (typeof SaveManager !== 'undefined') SaveManager.save();
        }
    } catch (err) {
        console.error(err);
        if (typeof showNotification === 'function') showNotification('操作失败：' + err, '❌');
    } finally {
        const btn = document.getElementById('btn-sync-chain');
        const fileInput = document.getElementById('ai-custom-file');
        if (btn) { btn.disabled = false; btn.innerHTML = '✨ 注入灵识 · 链上确权'; btn.style.filter = 'none'; }
        if (fileInput) fileInput.value = '';
    }
};

window.openWeb3History = function() {
    const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';
    if (typeof openWeb3Console === 'function') {
        openWeb3Console(currentName);
        setTimeout(() => { const historyTab = document.getElementById('tab-history'); if (historyTab) historyTab.click(); }, 100);
    }
};

const originalInitInheritor = window._initInheritorSession;
window._initInheritorSession = function(username) {
    if (typeof originalInitInheritor === 'function') {
        originalInitInheritor(username);
    } else {
        document.getElementById('inheritor-stats')?.classList.remove('hidden');
        document.getElementById('player-stats')?.classList.add('hidden');
        document.getElementById('player-dock')?.classList.add('hidden');
        const nameEl = document.getElementById('display-inheritor-name');
        if (nameEl) nameEl.innerText = username;
        if(typeof switchMainView === 'function') switchMainView('view-inheritor-dash', null);
        if(typeof showNotification === 'function') showNotification(`匠师 ${username}，欢迎回到工坊中控台！`, '⛩️');
    }
    renderInheritorDash();
};