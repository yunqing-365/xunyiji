/**
 * scripts/quest-engine.js
 * 寻遗集 · 动态任务引擎
 * 负责：任务状态初始化 / 事件分发监听 / 动态UI渲染 / 奖励发放
 */

let currentQuestTab = 'main'; // 当前选中的任务标签页

// 1. 初始化任务系统（从 game-content.js 拷贝数据到玩家存档）
window.initQuestEngine = function() {
    if (!gameState.quests) {
        // 深拷贝静态配置数据到全局状态，以便记录进度
        gameState.quests = JSON.parse(JSON.stringify(questData));
    }
    renderQuestPanel(currentQuestTab);
};

// 2. 核心：事件分发器（监听玩家的各种行为）
// 2. 核心：事件分发器（监听玩家的各种行为）
window.dispatchQuestEvent = function(eventName, amount = 1) {
    if (!gameState.quests) return;
    
    let isProgressUpdated = false;

    ['main', 'side', 'daily'].forEach(category => {
        const list = gameState.quests[category];
        if (!list) return; // 🌟 防崩溃核心：如果没有这个分类，直接跳过！

        list.forEach(quest => {
            if (quest.status !== 'active') return;

            let isQuestComplete = true;

            quest.objectives.forEach(obj => {
                // 🌟 兼容老代码的 func 字段和新代码的 event 字段
                const targetEvent = obj.event || obj.func; 
                
                if (targetEvent === eventName && obj.current < obj.required) {
                    obj.current = Math.min(obj.current + amount, obj.required);
                    isProgressUpdated = true;
                    
                    if (obj.current >= obj.required) {
                        if(typeof playSound === 'function') playSound('click');
                        if(typeof showNotification === 'function') showNotification(`目标达成：${obj.text}`, '📝');
                    }
                }
                if (obj.current < obj.required) {
                    isQuestComplete = false;
                }
            });

            if (isQuestComplete && isProgressUpdated) {
                _completeQuest(quest);
            }
        });
    });

    if (isProgressUpdated) {
        renderQuestPanel(currentQuestTab);
    }
};

// 3. 内部方法：结算任务奖励
function _completeQuest(quest) {
    quest.status = 'completed';
    
    // 发放灵石
    if (quest.reward.stones) {
        if(typeof earnStones === 'function') earnStones(quest.reward.stones);
    }
    // 发放物品
    if (quest.reward.items) {
        quest.reward.items.forEach(item => {
            if(typeof addItem === 'function') addItem(item.name, item.count);
        });
    }

    if(typeof playSound === 'function') playSound('achievement');
    if(typeof showNotification === 'function') {
        showNotification(`🎉 任务完成：【${quest.title}】！奖励已发放。`, '🏆', 5000);
    }

    // 这里可以拓展：触发后续任务
    _checkNextQuests(quest.id);
}

// 解锁前置条件匹配的新任务
function _checkNextQuests(completedQuestId) {
    ['main', 'side'].forEach(category => {
        gameState.quests[category].forEach(quest => {
            if (quest.status === 'inactive' && quest.prereq && quest.prereq.includes(completedQuestId)) {
                quest.status = 'active';
                showNotification(`📜 触发新任务：【${quest.title}】`, '✨', 6000);
            }
        });
    });
}

// 4. 动态渲染任务 UI
window.renderQuestPanel = function(tab = 'main') {
    currentQuestTab = tab;
    const contentBox = document.getElementById('quest-content');
    if (!contentBox) return;

    // 更新 Tab 按钮高亮
    document.querySelectorAll('.quest-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tab);
    });

    // 获取当前分类的数据
    const list = gameState.quests[tab] || [];
    const activeList = list.filter(q => q.status === 'active');

    if (activeList.length === 0) {
        contentBox.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color:#aaa;">
                <div style="font-size:40px; margin-bottom:10px; opacity:0.5;">🪹</div>
                <div>暂无进行中的${tab === 'main' ? '主线' : tab === 'daily' ? '日常' : '支线'}任务</div>
            </div>`;
        return;
    }

    contentBox.innerHTML = activeList.map(quest => {
        // 构建进度条
        const objectivesHtml = quest.objectives.map(obj => {
            const percent = (obj.current / obj.required) * 100;
            const isDone = obj.current >= obj.required;
            return `
                <div style="margin-top: 8px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:${isDone ? 'var(--jade)' : '#888'};">
                        <span>${isDone ? '✅' : '🔹'} ${obj.text}</span>
                        <span>${obj.current}/${obj.required}</span>
                    </div>
                    <div class="quest-progress-bar" style="height: 4px; background: #eee; margin-top: 3px; border-radius: 4px;">
                        <div style="height: 100%; width: ${percent}%; background: ${isDone ? 'var(--jade)' : 'var(--amber)'}; border-radius: 4px; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="quest-item" style="display:flex; gap:14px; background:white; padding:16px; border-radius:var(--radius-md); border:1px solid #eee; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
                <div class="quest-item-icon" style="width:40px; height:40px; border-radius:8px; background:#fafaf8; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; border:1px solid #ddd;">
                    ${quest.icon}
                </div>
                <div class="quest-item-body" style="flex:1;">
                    <div style="font-weight:bold; color:var(--ink); font-size:14px;">${quest.title}</div>
                    <div style="font-size:11px; color:#aaa; margin-top:2px;">${quest.desc}</div>
                    ${objectivesHtml}
                </div>
            </div>
        `;
    }).join('');
};

// 绑定 Tab 点击事件
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quest-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            renderQuestPanel(e.target.dataset.tab);
        });
    });
});