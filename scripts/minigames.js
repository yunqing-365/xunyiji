/**
 * minigames.js
 * 寻遗集 · 小游戏 & 活动系统模块
 * 负责：投壶小游戏 / 灯谜大会 / 每日签到 / 邮件系统 / 非遗百科
 */

// ============================================================
// 一、投壶小游戏
// ============================================================

function openMinigame() {
    gameState.gameScore = 0;
    gameState.power     = 0;

    const scoreEl = document.getElementById('game-score');
    if (scoreEl) scoreEl.innerText = '0';

    const powerFill = document.getElementById('power-fill');
    if (powerFill) powerFill.style.height = '0%';

    _resetArrow();

    document.getElementById('minigame-panel').classList.add('show');
    if(typeof playSound === 'function') playSound('minigame_open');
}

function closeMinigame() {
    _clearPowerInterval();
    document.getElementById('minigame-panel').classList.remove('show');
}

function startPower() {
    _clearPowerInterval();
    gameState.power = 0;
    gameState.powerInterval = setInterval(() => {
        gameState.power = (gameState.power + 2) % 102;
        const display = Math.min(gameState.power, 100);
        const powerFill = document.getElementById('power-fill');
        if (powerFill) powerFill.style.height = display + '%';
    }, 50);
}

function throwArrow() {
    _clearPowerInterval();

    const power   = Math.min(gameState.power, 100);
    const arrow   = document.getElementById('arrow');
    if (!arrow) return;

    const HIT_MIN = 38;
    const HIT_MAX = 62;
    const isHit   = power >= HIT_MIN && power <= HIT_MAX;

    const horizontalOffset = (Math.random() * 16 - 8).toFixed(1);
    const verticalTarget   = Math.max(20, 380 - power * 3.2);

    arrow.style.transition = 'top 0.75s cubic-bezier(0.25,0.46,0.45,0.94), left 0.75s ease';
    arrow.style.top  = verticalTarget + 'px';
    arrow.style.left = `calc(50% + ${horizontalOffset}px)`;

    setTimeout(() => {
        if (isHit) _onArrowHit(power);
        else _onArrowMiss(power);
        setTimeout(_resetArrow, 600);
    }, 750);
}

function _onArrowHit(power) {
    const bonus  = Math.round((1 - Math.abs(power - 50) / 12) * 5);
    const points = 10 + bonus;

    gameState.gameScore += points;
    const scoreEl = document.getElementById('game-score');
    if (scoreEl) scoreEl.innerText = gameState.gameScore;

    if(typeof showNotification === 'function') showNotification(`命中！+${points} 分 🎯`, '🎯');
    if(typeof playSound === 'function') playSound('hit');

    if (gameState.gameScore >= 50 && typeof unlockAchievement === 'function') {
        unlockAchievement('score_50', '神投手', '投壶累计得分达到 50 分', 200, '🎯');
    }
    if (gameState.gameScore % 50 === 0) {
        if(typeof earnStones === 'function') earnStones(30);
        if(typeof showNotification === 'function') showNotification('里程碑奖励：+30 灵石！', '🪙');
    }
}

function _onArrowMiss(power) {
    const hint = power < 38 ? '力道不足，再用力些！' : '力道过猛，稍微收一收！';
    if(typeof showNotification === 'function') showNotification(`未命中 — ${hint}`, '😅');
    if(typeof playSound === 'function') playSound('miss');
}

function _resetArrow() {
    const arrow = document.getElementById('arrow');
    if (!arrow) return;
    arrow.style.transition = 'none';
    arrow.style.top  = '60px';
    arrow.style.left = '50%';
}

function _clearPowerInterval() {
    if (gameState.powerInterval) {
        clearInterval(gameState.powerInterval);
        gameState.powerInterval = null;
    }
}


// ============================================================
// 二、灯谜大会 (已修复数据源引用)
// ============================================================

function openRiddleGame() {
    gameState.currentRiddle = 0;
    gameState.riddleScore   = 0;
    _loadRiddle(0);

    const scoreEl = document.getElementById('riddle-score');
    if(scoreEl) scoreEl.innerText = '0';
    document.getElementById('riddle-modal').classList.add('show');
    if(typeof playSound === 'function') playSound('riddle_open');
}

function closeRiddle() {
    document.getElementById('riddle-modal').classList.remove('show');
}

function submitRiddle() {
    const inputEl = document.getElementById('riddle-input');
    if (!inputEl) return;

    const userAnswer = inputEl.value.trim();
    // 🌟 修复：安全读取 riddleDatabase
    const db = typeof riddleDatabase !== 'undefined' ? riddleDatabase : [];
    const currentData = db[gameState.currentRiddle];
    
    if (!currentData) {
        if(typeof showNotification === 'function') showNotification('灯谜数据异常', '⚠️');
        return;
    }

    const correctAnswer = currentData.answer;

    if (!userAnswer) {
        if(typeof showNotification === 'function') showNotification('请输入答案再提交', '💡');
        return;
    }

    if (userAnswer === correctAnswer) {
        _onRiddleCorrect();
        // 触发任务埋点
        if(typeof dispatchQuestEvent === 'function') dispatchQuestEvent('play_riddle', 1);
    } else {
        _onRiddleWrong(correctAnswer);
    }

    gameState.currentRiddle++;

    if (gameState.currentRiddle >= db.length) {
        setTimeout(() => _onRiddleComplete(), 800);
    } else {
        inputEl.value = '';
        setTimeout(() => _loadRiddle(gameState.currentRiddle), 500);
    }
}

function _onRiddleCorrect() {
    const reward = 50;
    gameState.riddleScore += reward;
    if(typeof earnStones === 'function') earnStones(reward);

    const scoreEl = document.getElementById('riddle-score');
    if(scoreEl) scoreEl.innerText = gameState.riddleScore;
    if(typeof showNotification === 'function') showNotification(`答对了！+${reward} 灵石 🎉`, '✅');
    if(typeof playSound === 'function') playSound('correct');
    _flashInput('riddle-input', '#e0ece4');
}

function _onRiddleWrong(correctAnswer) {
    if(typeof showNotification === 'function') showNotification(`答错了，正确答案是：${correctAnswer}`, '❌');
    if(typeof playSound === 'function') playSound('wrong');
    _flashInput('riddle-input', '#fdecea');
}

function _onRiddleComplete() {
    const total = gameState.riddleScore;
    const grade = total >= 400 ? '🏆 灯谜宗师'
                : total >= 250 ? '🥈 灯谜高手'
                : total >= 100 ? '🥉 灯谜学徒'
                : '📖 继续努力';

    if(typeof showNotification === 'function') showNotification(`灯谜大会结束！积分 ${total} | ${grade}`, '🏮', 5000);
    closeRiddle();
}

function _loadRiddle(index) {
    const db = typeof riddleDatabase !== 'undefined' ? riddleDatabase : [];
    const data = db[index];
    if (!data) return;

    const numEl  = document.getElementById('riddle-num');
    const textEl = document.getElementById('riddle-text');
    const input  = document.getElementById('riddle-input');

    if (numEl)  numEl.innerText  = index + 1;
    if (textEl) textEl.innerText = data.text;
    if (input)  input.value      = '';
}

function _flashInput(inputId, color) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.style.backgroundColor = color;
    setTimeout(() => { el.style.backgroundColor = ''; }, 600);
}


// ============================================================
// 三、每日签到系统 (已彻底修复崩溃问题)
// ============================================================

function openCheckin() {
    renderCheckinCalendar();
    openModal('checkin-modal');
}

function renderCheckinCalendar() {
    const calendar = document.getElementById('checkin-calendar');
    if (!calendar) return;

    // 🌟 修复：安全读取 game-content.js 中的 checkinRewards
    const rewards = typeof checkinRewards !== 'undefined' ? checkinRewards : Array(7).fill({icon: '🎁', name: '神秘奖励'});

    calendar.innerHTML = Array.from({ length: 7 }, (_, i) => {
        const isChecked = i < gameState.checkinDay;
        const isToday   = i === gameState.checkinDay && !gameState.checkedIn;
        const rewardData = rewards[i] || {icon: '🎁', name: '神秘奖励'};

        return `
            <div class="checkin-day ${isChecked ? 'checked' : ''} ${isToday ? 'today' : ''}">
                <div class="checkin-reward">${rewardData.icon}</div>
                <div class="checkin-date">第 ${i + 1} 天</div>
                <div style="font-size:10px; color:${isChecked ? 'rgba(255,255,255,0.8)' : '#aaa'}; margin-top:4px; text-align:center; line-height:1.3;">
                    ${rewardData.name}
                </div>
            </div>
        `;
    }).join('');

    _syncCheckinButton();
}

function doCheckin() {
    if (gameState.checkedIn) {
        if(typeof showNotification === 'function') showNotification('今日已签到，明日再来~', '📅');
        return;
    }

    gameState.checkedIn = true;
    const dayIdx  = gameState.checkinDay;
    
    // 🌟 修复：安全发放奖励
    const rewards = typeof checkinRewards !== 'undefined' ? checkinRewards : [];
    const rewardData = rewards[dayIdx] || { icon: '🎁', name: '基础奖励', reward: {stones: 50} };

    if (rewardData.reward) {
        if (rewardData.reward.stones && typeof earnStones === 'function') earnStones(rewardData.reward.stones);
        if (rewardData.reward.item && typeof addItem === 'function') addItem(rewardData.reward.item, rewardData.reward.count || 1);
    }

    gameState.checkinDay = (gameState.checkinDay + 1) % 7;

    const badge = document.getElementById('checkin-badge');
    if (badge) badge.classList.add('hidden');

    renderCheckinCalendar();
    if(typeof showNotification === 'function') showNotification(`签到成功！获得 ${rewardData.name}`, '🎉');
    if(typeof playSound === 'function') playSound('checkin');
}

function _syncCheckinButton() {
    const btn = document.getElementById('checkin-btn');
    if (!btn) return;

    const dayIdx = gameState.checkinDay % 7;
    const rewards = typeof checkinRewards !== 'undefined' ? checkinRewards : [];
    const rewardData = rewards[dayIdx] || { icon: '🎁', name: '神秘奖励' };

    if (gameState.checkedIn) {
        btn.innerText   = '今日已签到 ✅';
        btn.disabled    = true;
        btn.style.opacity = '0.55';
    } else {
        btn.innerText   = `签到领取：${rewardData.name}`;
        btn.disabled    = false;
        btn.style.opacity = '1';
    }
}


// ============================================================
// 四、邮件系统
// ============================================================

const MAIL_DATA = [
    {
        id: 0, icon: '🎁', title: '【系统】欢迎来到寻遗集！',
        desc:  '这是你的新手大礼包，内含 200 灵石，请查收！',
        time:  '刚刚', read: false, reward: { stones: 200 }
    },
    {
        id: 1, icon: '⛩️', title: '【天工阁】王雪萍匠师的邀请',
        desc:  '王雪萍匠师邀请你前往天工阁学习苏绣技艺，期待与你同研针法。',
        time:  '10 分钟前', read: false, reward: null
    },
    {
        id: 2, icon: '📜', title: '【活动】元宵灯谜大会预告',
        desc:  '猜灯谜，赢大奖！活动即将开始，快去万象台参与。',
        time:  '1 小时前', read: true, reward: null
    }
];

function openMail() {
    renderMailList();
    openModal('mail-modal');
    const badge = document.getElementById('mail-badge');
    if (badge) badge.classList.add('hidden');
}

function renderMailList() {
    const listEl = document.getElementById('mail-list');
    if (!listEl) return;

    listEl.innerHTML = MAIL_DATA.map(mail => `
        <div class="mail-item ${mail.read ? '' : 'unread'}" id="mail-item-${mail.id}" onclick="readMail(${mail.id})">
            <div class="mail-icon" style="font-size:28px;">${mail.icon}</div>
            <div class="mail-info" style="flex:1;">
                <div class="mail-title" style="font-weight:bold; font-size:14px;">${mail.title}</div>
                <div class="mail-desc" style="font-size:12px; color:#888;">${mail.desc}</div>
                ${mail.reward ? `<div style="font-size:12px; color:var(--amber); margin-top:4px;">📦 附件奖励可领取</div>` : ''}
            </div>
            <div class="mail-time" style="font-size:11px; color:#bbb;">${mail.time}</div>
        </div>
    `).join('');
}

function readMail(id) {
    const mail = MAIL_DATA.find(m => m.id === id);
    if (!mail) return;

    if (!mail.read) {
        mail.read = true;
        const itemEl = document.getElementById(`mail-item-${id}`);
        if (itemEl) itemEl.classList.remove('unread');
    }

    if (mail.reward && !mail._claimed) {
        mail._claimed = true;
        const { stones, item, qty } = mail.reward;
        if (stones && typeof earnStones === 'function') earnStones(stones);
        if (item && typeof addItem === 'function')   addItem(item, qty || 1);

        if(typeof showNotification === 'function') showNotification(`已领取邮件奖励！`, '📬');
        if(typeof playSound === 'function') playSound('mail_claim');
        renderMailList();
    } else if (mail.reward && mail._claimed) {
        if(typeof showNotification === 'function') showNotification('该邮件附件已领取', '✅');
    }
}


// ============================================================
// 五、初始化
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const throwBtn = document.getElementById('throw-btn');
    if (throwBtn) {
        throwBtn.addEventListener('mousedown',  startPower);
        throwBtn.addEventListener('mouseup',    throwArrow);
        throwBtn.addEventListener('touchstart', startPower,  { passive: true });
        throwBtn.addEventListener('touchend',   throwArrow);
    }

    const riddleInput = document.getElementById('riddle-input');
    if (riddleInput) {
        riddleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitRiddle();
        });
    }
});

// ============================================================
// 六、异闻录 · 推演沙盘系统 (自由探索解谜引擎)
// ============================================================

// 预设的推演配方（玩家自由组合）
const DEDUCTION_RECIPES = [
    {
        clue1: '高岭陶土', clue2: '百年红酒', // 为什么是红酒？暗示冷热交替的冰裂，以及西域色彩
        resultName: '宋代冰裂纹残片', resultIcon: '🏺',
        successMsg: '不可思议...西域的红酒与东方陶土交融，竟然在表面凝结出了如冰川碎裂般的绝美纹路！你推演出了失传的【宋代冰裂纹残片】！'
    },
    {
        clue1: '戏服碎布', clue2: '云锦布料', 
        resultName: '乱针双面绣手记', resultIcon: '📕',
        successMsg: '两块来自不同时代的丝帛交织在一起，经纬线重组，显露出了隐藏在丝线排布中的【乱针双面绣手记】！'
    }
];

let currentDeductionSlots = [null, null];

window.renderDeductionBoard = function() {
    const listEl = document.getElementById('deduction-inventory');
    if (!listEl) return;
    listEl.innerHTML = '';
    let hasItems = false;

    // 读取行囊
    for (const [itemName, count] of Object.entries(gameState.inventory)) {
        if (count > 0) {
            const itemData = (typeof itemDatabase !== 'undefined' && itemDatabase[itemName]) ? itemDatabase[itemName] : null;
            if (itemData && ['material', 'prop', 'collection'].includes(itemData.type)) {
                hasItems = true;
                listEl.innerHTML += `
                    <div style="background:#fafaf8; border:1px solid #eee; border-radius:8px; padding:10px; text-align:center; cursor:pointer; transition:0.2s;" 
                         onclick="addToDeductionSlot('${itemName}', '${itemData.icon}')"
                         onmouseover="this.style.borderColor='var(--amber)'" onmouseout="this.style.borderColor='#eee'">
                        <div style="font-size:28px; margin-bottom:5px;">${itemData.icon}</div>
                        <div style="font-size:11px; font-weight:bold; color:var(--ink);">${itemName}</div>
                        <div style="font-size:10px; color:#888;">拥有: ${count}</div>
                    </div>`;
            }
        }
    }
    if (!hasItems) listEl.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#aaa; margin-top:50px;">行囊空空。<br>去九州搜集些可能含有因果的灵物吧！</div>';
};

window.addToDeductionSlot = function(itemName, icon) {
    if(typeof playSound === 'function') playSound('click');
    let slotIndex = currentDeductionSlots[0] === null ? 1 : (currentDeductionSlots[1] === null ? 2 : 0);
    if (slotIndex === 0) return showNotification('阵眼已满，请先点击移除', '⚠️');
    
    currentDeductionSlots[slotIndex - 1] = itemName;
    const slotEl = document.getElementById(`deduction-slot-${slotIndex}`);
    slotEl.innerHTML = `<div style="font-size:38px;">${icon}</div><div style="font-size:11px; font-weight:bold; color:var(--gold); margin-top:8px;">${itemName}</div>`;
    slotEl.style.borderColor = 'var(--gold)'; slotEl.style.background = 'rgba(212,175,55,0.1)';
    _checkDeductionState();
};

window.clearDeductionSlot = function(slotIndex) {
    currentDeductionSlots[slotIndex - 1] = null;
    const slotEl = document.getElementById(`deduction-slot-${slotIndex}`);
    slotEl.innerHTML = `<div style="font-size:30px; opacity:0.3;">➕</div><div style="font-size:12px; color:#888; margin-top:5px;">线索 ${slotIndex === 1 ? '一' : '二'}</div>`;
    slotEl.style.borderColor = 'rgba(212,175,55,0.5)'; slotEl.style.background = 'rgba(255,255,255,0.05)';
    _checkDeductionState();
};

function _checkDeductionState() {
    const btn = document.getElementById('btn-execute-deduction');
    const hint = document.getElementById('deduction-ai-hint');
    if (currentDeductionSlots[0] && currentDeductionSlots[1]) {
        btn.disabled = false; btn.style.opacity = '1';
        hint.innerHTML = '<span style="color:var(--amber); font-weight:bold;">🤖 元神推演中：</span>这两件物品似乎存在某种因果...可以尝试注入灵力推演！';
    } else {
        btn.disabled = true; btn.style.opacity = '0.5';
        hint.innerHTML = '<span style="color:var(--jade); font-weight:bold;">🤖 元神寄语：</span>请放入两件灵物。';
    }
}

window.executeDeduction = function() {
    const i1 = currentDeductionSlots[0], i2 = currentDeductionSlots[1];
    const btn = document.getElementById('btn-execute-deduction');
    const hint = document.getElementById('deduction-ai-hint');
    
    if (!gameState.inventory[i1] || !gameState.inventory[i2]) return showNotification('行囊物品不足', '❌');
    
    btn.innerText = '💫 阵法运转中...'; btn.disabled = true;
    if(typeof playSound === 'function') playSound('magic');
    document.getElementById('view-deduction').style.animation = 'shake 0.5s ease';
    setTimeout(() => document.getElementById('view-deduction').style.animation = '', 500);

    setTimeout(() => {
        btn.innerText = '注入灵力 · 开启推演';
        const recipe = DEDUCTION_RECIPES.find(r => (r.clue1 === i1 && r.clue2 === i2) || (r.clue1 === i2 && r.clue2 === i1));

        if (recipe) {
            gameState.inventory[i1]--; gameState.inventory[i2]--;
            if (typeof addItem === 'function') addItem(recipe.resultName, 1);
            
            hint.innerHTML = `<div style="color:var(--gold); font-size:15px; font-weight:bold; margin-bottom:5px;">✨ 推演大成功！</div>
                              <div style="color:#e8dcc8;">${recipe.successMsg}</div>`;
            showNotification(`绝密线索现世！获得【${recipe.resultName}】`, recipe.resultIcon, 5000);
        } else {
            hint.innerHTML = `<span style="color:var(--cinnabar); font-weight:bold;">🤖 阵法反噬：</span>毫无反应。九州万物相生相克，这两样东西显然不搭，换个思路吧。`;
            showNotification('推演失败，线索不匹配', '💨');
        }
        
        clearDeductionSlot(1); clearDeductionSlot(2); renderDeductionBoard();
    }, 1500);
};

// 专门为厚重历史准备的阅读回调
window.readEpicLore = function(itemName) {
    const itemData = itemDatabase[itemName];
    if (itemData && itemData.loreText) {
        closeModal('item-detail-modal');
        // 弹出极具仪式感的历史阅读框
        openStoryModal('📖 千古遗音', itemName, itemData.loreText);
        showNotification('获得了一段沉重的九州往事，此物可赠予相关的非遗匠师！', '📜', 5000);
    }
};