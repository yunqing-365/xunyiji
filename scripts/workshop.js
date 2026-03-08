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

// 动态渲染中控台面板 (增加 AI 灵识调教区)
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

    // 获取当前登录传承人的名字，用来加载他之前保存的 AI 设定
    const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';
    const customAI = (gameState.customAI && gameState.customAI[currentName]) ? gameState.customAI[currentName] : { personality: '', knowledge: '' };

    // 3. 🌟 新增：AI 分身调教区 (RAG 知识库雏形，支持文档上传)
    let aiConfigHTML = `
        <div class="dash-card" style="grid-column: 1 / -1; border: 2px solid var(--purple); background: linear-gradient(180deg, #fdfbf7, white);">
            <div class="dash-card-title" style="color:var(--purple); border-bottom-color:var(--purple);">🧠 AI数字灵体</div>
            <div style="font-size:13px; color:#666; margin-bottom:15px;">在此注入您的非遗绝学。当大世界中的游历者与您的 AI 分身对话时，天道(系统) 将自动基于以下秘籍进行回答。</div>
            
            <div style="display:flex; gap:20px; margin-bottom: 15px;">
                <div style="flex:1;">
                    <div style="font-size:12px; font-weight:bold; margin-bottom:5px; color:var(--ink);">🎭 设定分身性格：</div>
                    <textarea id="ai-custom-personality" placeholder="例如：性格古怪的老头，但一提到苏绣就会变得非常狂热..." style="width:100%; height:80px; padding:12px; border-radius:8px; border:1px solid #ccc; font-family:inherit; resize:none;">${customAI.personality}</textarea>
                </div>
                <div style="flex:2;">
                    <div style="font-size:12px; font-weight:bold; margin-bottom:5px; color:var(--ink);">📜 注入核心技艺 (语料库)：</div>
                    <textarea id="ai-custom-knowledge" placeholder="例如：双面绣的核心在于藏针脚，起针时绝不能打结，而是要..." style="width:100%; height:80px; padding:12px; border-radius:8px; border:1px solid #ccc; font-family:inherit; resize:none;">${customAI.knowledge}</textarea>
                </div>
            </div>

            <div style="padding: 15px; border: 1px dashed var(--purple); border-radius: 8px; background: rgba(138, 109, 168, 0.05); display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <div style="font-size:13px; font-weight:bold; color:var(--purple); margin-bottom:4px;">📁 可上传非遗典籍资料 (支持 Word / PDF / TXT)</div>
                    <div style="font-size:11px; color:#888;">上传后，天道引擎将自动提取文本，作为您的分身记忆。</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="file" id="ai-custom-file" accept=".pdf,.doc,.docx,.txt" style="font-size:12px; color:var(--ink); max-width: 200px;">
                </div>
            </div>
            
            <button class="btn btn-purple" style="margin-top:15px; width:100%; font-size:15px; padding:12px;" onclick="saveAIConfig()">✨ 将数字灵体同步至九州天道</button>
        </div>
    `;

    // 🌟 修复：这里是缺失的渲染代码！必须把上面拼装好的 HTML 塞进容器里
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
            ${aiConfigHTML}
        </div>
    `;
};

// 保存 AI 配置的方法 (加入文档解析模拟)
window.saveAIConfig = function() {
    const personality = document.getElementById('ai-custom-personality').value.trim();
    let knowledge = document.getElementById('ai-custom-knowledge').value.trim();
    const currentName = document.getElementById('display-inheritor-name')?.innerText || '未知匠师';

    // 检查是否有文件上传
    const fileInput = document.getElementById('ai-custom-file');
    let extraNotif = '';
    
    if (fileInput && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        extraNotif = `\n📄 成功解析典籍：《${fileName}》`;
        // 模拟：将文件名作为一个标记存入知识库中，方便在对话中体现
        knowledge += `\n[系统注：大模型已读取典籍《${fileName}》的内容]`;
        
        // 清空 file input 表现出已上传的感觉
        fileInput.value = '';
    }

    if (!gameState.customAI) gameState.customAI = {};
    
    gameState.customAI[currentName] = {
        personality: personality || '严谨的传承人',
        knowledge: knowledge || '技艺精湛，但不善言辞。'
    };
    
    if (typeof SaveManager !== 'undefined') SaveManager.save();
    
    if (typeof playSound === 'function') playSound('magic');
    showNotification('AI 分身认知已更新，大世界数据已同步！' + extraNotif, '🧠', 5000);
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

// ==========================================
// 🔗 匠师中控台：AI灵识培养 & Web3数字确权 (终极版)
// ==========================================
window.openWeb3Console = function(inheritorName = "万艺城·匿名匠师") {
    document.getElementById('web3-console')?.remove();

    const panel = document.createElement('div');
    panel.id = 'web3-console';
    panel.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:680px; height:520px; background:linear-gradient(135deg, rgba(20,20,30,0.98), rgba(10,10,15,0.98)); border:1px solid #d4af37; border-radius:12px; box-shadow: 0 0 30px rgba(212,175,55,0.2), inset 0 0 15px rgba(212,175,55,0.1); z-index:3000; color:#e8dcc8; font-family:sans-serif; display:flex; flex-direction:column; overflow:hidden;`;

    // 顶部标题和双页签 (Tabs)
    panel.innerHTML = `
        <div style="padding:20px 30px; border-bottom:1px solid rgba(212,175,55,0.3); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3);">
            <div style="display:flex; gap:20px;">
                <button id="tab-upload" style="background:none; border:none; color:#d4af37; font-size:18px; font-weight:bold; text-shadow:0 0 10px rgba(212,175,55,0.5); cursor:pointer; padding-bottom:5px; border-bottom:2px solid #d4af37;">📤 灵识培养与上链</button>
                <button id="tab-history" style="background:none; border:none; color:#888; font-size:18px; font-weight:bold; cursor:pointer; padding-bottom:5px; border-bottom:2px solid transparent; transition:0.3s;">📜 链上确权资产</button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#aaa; font-size:24px; cursor:pointer;">×</button>
        </div>
        
        <div id="panel-upload" style="padding:30px; flex:1; overflow-y:auto;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px; padding:10px 15px; background:rgba(212,175,55,0.1); border-radius:8px;">
                <span style="font-size:24px;">🧑‍🎨</span>
                <div>
                    <div style="font-size:12px; color:#aaa;">当前授权匠师</div>
                    <div style="font-weight:bold; color:#d4af37;">${inheritorName}</div>
                </div>
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:13px; color:#aaa; margin-bottom:8px;">选择非遗典籍/配方文件 (支持 PDF, Doc, Txt, 图片)</label>
                <div style="border:2px dashed rgba(212,175,55,0.4); border-radius:8px; padding:20px; text-align:center; position:relative; background:rgba(0,0,0,0.3); transition:0.3s;" id="file-drop-area">
                    <input type="file" id="w3-file" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer;">
                    <div style="font-size:32px; margin-bottom:10px;">📄</div>
                    <div id="file-name-display" style="color:#d4af37; font-weight:bold;">点击此处，或拖拽文件至此</div>
                    <div style="font-size:12px; color:#888; margin-top:5px;">系统将在本地提取指纹上链，并同步喂养您的 AI 灵识</div>
                </div>
            </div>

            <div id="w3-result" style="display:none; margin-bottom:20px; padding:15px; border-left:4px solid #00ffaa; background:rgba(0,255,170,0.05); font-size:13px; word-break:break-all; border-radius:0 8px 8px 0;"></div>

            <button id="w3-btn-submit" disabled style="width:100%; padding:14px; background:linear-gradient(90deg, #555, #333); border:1px solid #666; border-radius:8px; color:#aaa; font-weight:bold; font-size:16px; cursor:not-allowed; transition:0.3s; margin-top:auto;">
                等待选择文件...
            </button>
        </div>

        <div id="panel-history" style="padding:30px; flex:1; overflow-y:auto; display:none;">
            <div id="history-loading" style="text-align:center; color:#d4af37; padding:40px;">
                <div class="anim-blink">🔄 正在与区块链节点同步数据...</div>
            </div>
            <div id="history-list" style="display:flex; flex-direction:column; gap:15px;"></div>
        </div>
    `;

    document.body.appendChild(panel);

    // =====================================
    // 逻辑控制区
    // =====================================
    const tabUpload = document.getElementById('tab-upload');
    const tabHistory = document.getElementById('tab-history');
    const panelUpload = document.getElementById('panel-upload');
    const panelHistory = document.getElementById('panel-history');
    const fileInput = document.getElementById('w3-file');
    const btnSubmit = document.getElementById('w3-btn-submit');
    const fileNameDisplay = document.getElementById('file-name-display');

    // 切换页签逻辑
    const switchTab = (tab) => {
        if (tab === 'upload') {
            tabUpload.style.color = '#d4af37'; tabUpload.style.borderBottomColor = '#d4af37';
            tabHistory.style.color = '#888'; tabHistory.style.borderBottomColor = 'transparent';
            panelUpload.style.display = 'block'; panelHistory.style.display = 'none';
        } else {
            tabUpload.style.color = '#888'; tabUpload.style.borderBottomColor = 'transparent';
            tabHistory.style.color = '#d4af37'; tabHistory.style.borderBottomColor = '#d4af37';
            panelUpload.style.display = 'none'; panelHistory.style.display = 'block';
            loadHistory(); // 切换到历史页时自动拉取链上数据
        }
    };
    tabUpload.onclick = () => switchTab('upload');
    tabHistory.onclick = () => switchTab('history');

    // 文件选择逻辑
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            fileNameDisplay.innerText = `📁 已选择: ${fileInput.files[0].name}`;
            btnSubmit.disabled = false;
            btnSubmit.style.background = 'linear-gradient(90deg, #d4af37, #b8860b)';
            btnSubmit.style.color = '#000';
            btnSubmit.style.borderColor = '#d4af37';
            btnSubmit.style.boxShadow = '0 0 15px rgba(212,175,55,0.4)';
            btnSubmit.innerHTML = '✨ 注入灵识 并 链上确权';
            btnSubmit.style.cursor = 'pointer';
        }
    };

    // 上链与培灵逻辑
    btnSubmit.onclick = () => {
        const file = fileInput.files[0];
        if (!file) return;

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '🔄 正在提取数字指纹并铸造区块...';
        btnSubmit.style.filter = 'grayscale(1)';
        document.getElementById('w3-result').style.display = 'none';

        // 核心：使用 FileReader 读取文件内容，并发送给后端确权
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // 将文件转为 Base64 字符串发送给后端进行哈希计算和上链
                const fileContent = e.target.result; 
                
                const response = await fetch('http://localhost:3000/api/register-knowledge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inheritorName, fileName: file.name, fileContent })
                });

                const data = await response.json();

                if (data.success) {
                    document.getElementById('w3-result').style.display = 'block';
                    document.getElementById('w3-result').innerHTML = `
                        <div style="color:#00ffaa; font-weight:bold; margin-bottom:10px; font-size:15px;">🎉 灵识注入完毕，资产确权成功！</div>
                        <div style="margin-bottom:5px;"><span style="color:#888;">📜 唯一数字指纹:</span><br><span style="color:#fff; font-family:monospace;">${data.documentHash}</span></div>
                        <div style="margin-bottom:5px;"><span style="color:#888;">📦 确权区块高度:</span> <span style="color:#d4af37;">#${data.blockNumber}</span></div>
                        <div><span style="color:#888;">🔗 交易凭证 (TxHash):</span><br><span style="color:#00aaff; font-family:monospace;">${data.txHash}</span></div>
                    `;
                    btnSubmit.innerHTML = '✅ 确权完成';
                    if (typeof showNotification === 'function') showNotification('非遗数字资产铸造成功！', '⛓️');
                } else {
                    throw new Error(data.error);
                }
            } catch (err) {
                alert('上链失败：' + err.message);
                btnSubmit.innerHTML = '✨ 重试注入灵识';
                btnSubmit.disabled = false;
                btnSubmit.style.filter = 'none';
            }
        };
        reader.readAsDataURL(file); // 读取文件
    };

    // 拉取历史记录逻辑
    const loadHistory = async () => {
        const listDiv = document.getElementById('history-list');
        const loadingDiv = document.getElementById('history-loading');
        listDiv.innerHTML = '';
        loadingDiv.style.display = 'block';

        try {
            const response = await fetch(`http://localhost:3000/api/knowledge-history?inheritorName=${encodeURIComponent(inheritorName)}`);
            const data = await response.json();
            
            loadingDiv.style.display = 'none';

            if (!data.success) throw new Error(data.error);
            if (data.history.length === 0) {
                listDiv.innerHTML = `<div style="text-align:center; color:#888; padding:30px;">该匠师尚无上链的确权资产。</div>`;
                return;
            }

            // 渲染历史记录卡片
            data.history.forEach(item => {
                const dateStr = new Date(item.timestamp).toLocaleString();
                const card = document.createElement('div');
                card.style.cssText = `background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.2); border-radius:8px; padding:15px; position:relative; overflow:hidden;`;
                card.innerHTML = `
                    <div style="position:absolute; top:0; right:0; background:rgba(212,175,55,0.2); color:#d4af37; padding:2px 10px; font-size:11px; border-bottom-left-radius:8px;">已确权</div>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                        <span style="font-size:20px;">📄</span>
                        <span style="font-weight:bold; color:#e8dcc8; font-size:15px;">${item.fileName}</span>
                    </div>
                    <div style="font-size:12px; color:#aaa; margin-bottom:6px;">
                        <span style="color:#888;">确权时间：</span>${dateStr}
                    </div>
                    <div style="font-size:11px; color:#aaa; word-break:break-all; background:rgba(0,0,0,0.4); padding:8px; border-radius:4px; font-family:monospace;">
                        <span style="color:#888;">文件数字指纹 (Hash):</span><br>${item.documentHash}
                    </div>
                `;
                listDiv.appendChild(card);
            });
        } catch (err) {
            loadingDiv.innerHTML = `<span style="color:#ff4444;">❌ 拉取失败: ${err.message}</span>`;
        }
    };
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