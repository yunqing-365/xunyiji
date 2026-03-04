/**
 * workshop.js
 * 寻遗集 · 天工阁模块
 * 负责：匠师数据管理 / 卡片渲染 / 分类筛选 / 匠人故事弹窗 / 传承人中控台
 *
 * 依赖：core.js（showNotification, openModal, closeModal, openStoryModal,
 * playSound, switchMainView）
 */

// ============================================================
// 二、分类筛选
// ============================================================

let _currentWorkshopCategory = 'all';

function filterWorkshop(category) {
    _currentWorkshopCategory = category;

    // 更新筛选标签高亮
    document.querySelectorAll('#view-workshop .filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    renderWorkshop(category);
}


// ============================================================
// 三、卡片渲染
// ============================================================

function renderWorkshop(category = 'all', customList = null) {
    const grid = document.getElementById('workshop-grid');
    if (!grid) return;

    // 获取数据（确保 inheritors.js 已加载）
    const list = customList
        ?? (category === 'all'
            ? inheritorData
            : inheritorData.filter(item => item.category === category));

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px; color:#aaa;">
                <div style="font-size:48px; margin-bottom:15px;">🔍</div>
                <p>暂无符合条件的匠师</p>
            </div>`;
        return;
    }

    grid.innerHTML = list.map((inheritor, idx) => _buildInheritorCard(inheritor, idx)).join('');

    // 进度条动画（延迟触发）
    requestAnimationFrame(() => {
        grid.querySelectorAll('.progress-fill').forEach(bar => {
            const target = bar.dataset.progress;
            bar.style.width = target + '%';
        });
    });
}

/**
 * ✅ 修复：调整按钮大小(btn-sm)，修复弹窗传参问题
 */
function _buildInheritorCard(inheritor, idx) {
    const levelColor = inheritor.level === '国家级' ? 'var(--gold)' : 'var(--jade)';
    const canTransfer = inheritor.progress >= 100;

    return `
        <div class="workshop-card scroll-reveal" style="animation-delay:${idx * 0.06}s;">
            <span class="workshop-level-badge" style="background:${levelColor}; color:${inheritor.level === '国家级' ? 'var(--ink)' : 'white'};">
                ${inheritor.level}
            </span>

            <div class="inheritor-info">
                <div class="avatar avatar-md">${inheritor.avatar}</div>
                <div>
                    <h3 class="inheritor-name">${inheritor.name}</h3>
                    <p class="inheritor-title">${inheritor.title}</p>
                </div>
            </div>

            <div class="workshop-work-box">
                <div class="workshop-work-header">
                    <span class="workshop-work-name">虚实造物：${inheritor.workName}</span>
                    <span class="workshop-progress-label">研习进度：${inheritor.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" data-progress="${inheritor.progress}" style="width:0%;"></div>
                </div>
            </div>

            <div class="workshop-actions">
                <button class="btn btn-sm" onclick="showNotification('研习模块即将开放', '🛠️')">研习技艺</button>
                <button class="btn btn-sm" onclick="openInheritorStory(${inheritor.id})">传承故事</button>
                <button class="btn btn-sm btn-outline" onclick="showNotification('已提交拜师申请！', '📜')">拜师学艺</button>
                <button class="btn btn-sm ${canTransfer ? 'btn-outline' : 'btn-ghost'}" 
                        onclick="${canTransfer ? `showNotification('流转契约已生成', '📦')` : `showNotification('需研习进度100%方可解锁', '🔒')`}"
                        ${!canTransfer ? 'disabled' : ''}>
                    ${canTransfer ? '现世流转' : '未解锁'}
                </button>
            </div>
        </div>
    `;
}

// ============================================================
// 四、匠人故事弹窗 & 五、传承人中控台 & 六、灵犀袋筛选
// (完全保留你原来的逻辑)
// ============================================================

function openInheritorStory(id) {
    const inheritor = inheritorData.find(i => i.id === id);
    if (!inheritor) return;
    openStoryModal(inheritor.name, inheritor.title, inheritor.story);
}

function markOrderShipped(btn, orderName) {
    btn.innerText     = '✅ 已发货';
    btn.disabled      = true;
    btn.style.opacity = '0.6';
    if(typeof showNotification === 'function') showNotification(`【${orderName}】已标记发货，快递单号已同步至游历者`, '📦');
}

function publishNewExam() {
    const title = prompt('请输入研习考卷标题：');
    if (title && title.trim()) {
        if(typeof showNotification === 'function') showNotification(`研习考卷《${title.trim()}》已发布，游历者可前来作答`, '📋');
    }
}

function uploadBlueprint() {
    if(typeof showNotification === 'function') showNotification('图纸上传功能开放中，请前往 PC 端操作', '🗂️');
}

function startLiveClass() {
    if(typeof showNotification === 'function') showNotification('直播间准备中…请稍候，游历者将收到开播通知', '📡');
}

function filterInventory(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    if (typeof updateInventory === 'function') updateInventory(type);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('workshop-grid')) {
        renderWorkshop();
    }
    _bindDashboardButtons();
});

function _bindDashboardButtons() {
    const btnMap = {
        'btn-publish-exam':  publishNewExam,
        'btn-upload-blueprint': uploadBlueprint,
        'btn-start-live':    startLiveClass
    };
    for (const [id, handler] of Object.entries(btnMap)) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    }
}

// ============================================================
// 七、传承人 (匠师) 中控台动态逻辑
// ============================================================

// 模拟数据库：传承人工坊的状态
const inheritorState = {
    disciples: [
        { id: 1, name: '星渊', level: '入门弟子', progress: 45, task: '基础平绣练习' },
        { id: 2, name: '林深见鹿', level: '记名弟子', progress: 12, task: '认丝理线' }
    ],
    orders: [
        { id: 101, item: '苏绣青皮团扇', buyer: '云客', status: 'pending', date: '10分钟前' }
    ],
    messages: [
        { id: 1, from: '游历者·七七', content: '匠师，请问那个孔雀羽线怎么搭配颜色更好呀？' }
    ]
};

// 动态渲染中控台面板
window.renderInheritorDash = function() {
    const container = document.getElementById('inheritor-dash-content');
    if (!container) return;

    // 1. 渲染门徒管理区
    let disciplesHTML = inheritorState.disciples.map(d => `
        <div class="dash-list-item">
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="avatar avatar-sm">🧑‍🎓</div>
                <div>
                    <div style="font-weight:bold; font-size:14px;">${d.name} <span style="font-size:11px; color:var(--jade); background:#e8f4ef; padding:2px 6px; border-radius:4px;">${d.level}</span></div>
                    <div style="font-size:12px; color:#888; margin-top:4px;">当前研习：${d.task} (进度 ${d.progress}%)</div>
                </div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="gradeDisciple(${d.id})">点评指点</button>
        </div>
    `).join('');

    // 2. 渲染现世流转订单区
    let ordersHTML = inheritorState.orders.length > 0 ? inheritorState.orders.map(o => `
        <div class="dash-list-item" id="order-${o.id}">
            <div>
                <div style="font-weight:bold; font-size:14px; color:var(--cinnabar);">📦 订单：${o.item}</div>
                <div style="font-size:12px; color:#888; margin-top:4px;">游历者：${o.buyer} | 时间：${o.date}</div>
            </div>
            ${o.status === 'pending' 
                ? `<button class="btn btn-sm btn-gold" onclick="shipOrder(${o.id})">确认发货</button>` 
                : `<span style="color:var(--jade); font-size:13px; font-weight:bold;">✅ 已发货</span>`}
        </div>
    `).join('') : '<div style="color:#aaa; font-size:13px; padding:10px;">暂无待处理订单</div>';

    // 3. 渲染飞鸽传书区
    let messagesHTML = inheritorState.messages.map(m => `
        <div class="dash-list-item" style="flex-direction:column; align-items:flex-start; gap:10px;">
            <div style="font-size:12px; color:#888;">来自 ${m.from}：</div>
            <div style="font-size:14px; color:var(--ink); background:#fafaf8; padding:10px; border-radius:8px; width:100%; border:1px dashed #ddd;">"${m.content}"</div>
            <button class="btn btn-sm btn-outline" style="align-self:flex-end;" onclick="replyMessage(${m.id})">回复解答</button>
        </div>
    `).join('');

    // 拼装网格
    container.innerHTML = `
        <div class="dash-grid">
            <div class="dash-card">
                <div class="dash-card-title">👨‍🎓 门下弟子 (${inheritorState.disciples.length}人)</div>
                <div style="display:flex; flex-direction:column; gap:12px;">${disciplesHTML}</div>
            </div>
            <div class="dash-card">
                <div class="dash-card-title">📦 现世流转订单</div>
                <div style="display:flex; flex-direction:column; gap:12px;">${ordersHTML}</div>
            </div>
            <div class="dash-card" style="grid-column: 1 / -1;">
                <div class="dash-card-title">🕊️ 飞鸽传书 (答疑解惑)</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">${messagesHTML}</div>
            </div>
        </div>
    `;
};

// --- 交互动作 ---

window.gradeDisciple = function(id) {
    const d = inheritorState.disciples.find(x => x.id === id);
    if (!d) return;
    d.progress = Math.min(100, d.progress + Math.floor(Math.random() * 15 + 5)); // 随机增加进度
    showNotification(`已对【${d.name}】进行点评，其研习进度提升至 ${d.progress}%！`, '🎓');
    playSound('magic');
    renderInheritorDash(); // 重新渲染刷新数据
};

window.shipOrder = function(id) {
    const o = inheritorState.orders.find(x => x.id === id);
    if (!o) return;
    o.status = 'shipped';
    showNotification(`【${o.item}】已标记发货！顺丰单号已同步给玩家。`, '🚚');
    playSound('achievement');
    renderInheritorDash();
};

window.replyMessage = function(id) {
    const reply = prompt("请输入回复内容：");
    if (reply && reply.trim() !== '') {
        // 从列表中移除已回复的消息
        inheritorState.messages = inheritorState.messages.filter(x => x.id !== id);
        showNotification('回复已飞鸽传书发送给玩家！', '🕊️');
        renderInheritorDash();
    }
};

window.openPublishModal = function() {
    openModal('publish-blueprint-modal');
};

window.submitBlueprint = function() {
    const name = document.getElementById('bp-name').value;
    const mat = document.getElementById('bp-mat1').value;
    if (!name || !mat) {
        showNotification('请填写完整的图纸信息！', '⚠️');
        return;
    }
    
    // 模拟大世界广播
    showNotification(`【全服公告】您已成功发布新图纸《${name}》！玩家现可前往探索获取。`, '📢', 5000);
    closeModal('publish-blueprint-modal');
    playSound('checkin');
    
    // 清空表单
    document.getElementById('bp-name').value = '';
    document.getElementById('bp-mat1').value = '';
    document.getElementById('bp-num1').value = '';
};

// 确保匠师登录时能正确调用渲染函数
const originalInitInheritor = window._initInheritorSession;
window._initInheritorSession = function(username) {
    if (typeof originalInitInheritor === 'function') {
        originalInitInheritor(username);
    } else {
        document.getElementById('inheritor-stats').classList.remove('hidden');
        document.getElementById('player-stats').classList.add('hidden');
        document.getElementById('player-dock').classList.add('hidden');
        const nameEl = document.getElementById('display-inheritor-name');
        if (nameEl) nameEl.innerText = username;
        switchMainView('view-inheritor-dash', null);
        showNotification(`匠师 ${username}，欢迎回到工坊中控台！`, '⛩️');
    }
    renderInheritorDash(); // 登录时强制渲染数据
};