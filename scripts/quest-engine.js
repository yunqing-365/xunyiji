/**
 * scripts/quest-engine.js
 * 寻遗集 · 动态任务引擎 (无HUD纯净版)
 */

let currentQuestTab = 'main'; 

window.initQuestEngine = function() {
    if (!gameState.quests || !gameState.quests.main || !gameState.quests.main.find(q => q.id === 'main_01')) {
        gameState.quests = JSON.parse(JSON.stringify(questData));
        if (typeof SaveManager !== 'undefined') SaveManager.save();
    }
    renderQuestPanel(currentQuestTab);
    
    // 清理可能残留的HUD DOM
    const hud = document.getElementById('quest-tracker-hud');
    if(hud) hud.remove(); 
};

window.dispatchQuestEvent = function(eventName, amount = 1) {
    if (!gameState.quests) return;
    
    let isProgressUpdated = false;

    ['main', 'side', 'daily'].forEach(category => {
        const list = gameState.quests[category];
        if (!list) return;

        list.forEach(quest => {
            if (quest.status !== 'active') return;

            let isQuestComplete = true;

            quest.objectives.forEach(obj => {
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
        if (typeof SaveManager !== 'undefined') SaveManager.save();
        renderQuestPanel(currentQuestTab);
    }
};

function _completeQuest(quest) {
    quest.status = 'completed';
    
    if (quest.reward.stones && typeof earnStones === 'function') {
        earnStones(quest.reward.stones);
    }
    if (quest.reward.items) {
        quest.reward.items.forEach(item => {
            if(typeof addItem === 'function') addItem(item.name, item.count);
        });
    }

    if(typeof playSound === 'function') playSound('achievement');
    if(typeof showNotification === 'function') {
        showNotification(`🎉 任务完成：【${quest.title}】！奖励已发放。`, '🏆', 5000);
    }

    setTimeout(() => _checkNextQuests(quest.id), 1500);
}

function _checkNextQuests(completedQuestId) {
    let newlyUnlocked = false;
    ['main', 'side'].forEach(category => {
        gameState.quests[category].forEach(quest => {
            if (quest.status === 'inactive' && quest.prereq && quest.prereq.includes(completedQuestId)) {
                quest.status = 'active';
                newlyUnlocked = true;
                setTimeout(() => {
                    showNotification(`📜 触发新任务：【${quest.title}】`, '✨', 6000);
                    if(typeof playSound === 'function') playSound('magic');
                }, 500);
            }
        });
    });
    
    if (newlyUnlocked) {
        if (typeof SaveManager !== 'undefined') SaveManager.save();
        renderQuestPanel(currentQuestTab);
    }
}

window.renderQuestPanel = function(tab = 'main') {
    currentQuestTab = tab;
    const contentBox = document.getElementById('quest-content');
    if (!contentBox) return;

    document.querySelectorAll('.quest-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tab);
    });

    const list = gameState.quests[tab] || [];
    const activeList = list.filter(q => q.status === 'active');

    if (activeList.length === 0) {
        contentBox.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color:#aaa;">
                <div style="font-size:40px; margin-bottom:10px; opacity:0.5;">🪹</div>
                <div>暂无进行中的任务</div>
                <div style="font-size:12px; margin-top:5px;">去大世界探索寻找机缘吧</div>
            </div>`;
        return;
    }

    contentBox.innerHTML = activeList.map(quest => {
        const objectivesHtml = quest.objectives.map(obj => {
            const percent = (obj.current / obj.required) * 100;
            const isDone = obj.current >= obj.required;
            return `
                <div style="margin-top: 8px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:${isDone ? 'var(--jade)' : '#888'}; font-weight:${isDone ? 'bold' : 'normal'}">
                        <span>${isDone ? '✅' : '🔹'} ${obj.text}</span>
                        <span>${obj.current}/${obj.required}</span>
                    </div>
                    <div class="quest-progress-bar" style="height: 4px; background: #eee; margin-top: 3px; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${percent}%; background: ${isDone ? 'var(--jade)' : 'var(--amber)'}; transition: width 0.5s ease;"></div>
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
                    <div style="font-size:11px; color:#888; margin-top:4px; line-height:1.5;">${quest.desc}</div>
                    <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #eee;">
                        ${objectivesHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quest-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            renderQuestPanel(e.target.dataset.tab);
        });
    });
});