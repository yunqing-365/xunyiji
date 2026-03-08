/**
 * auth.js
 * 寻遗集 · 鉴权模块
 * 负责：角色切换 / 登录注册 UI 状态 / 登录处理 / 登出
 *
 * 依赖：core.js（gameState, showNotification, updateStats,
 *               updateInventory, switchMainView, renderWorkshop,
 *               renderEncyclopedia, renderCheckinCalendar）
 */

// ============================================================
// 一、模块级状态
// ============================================================

/**
 * 当前选中的角色
 * @type {'player' | 'inheritor'}
 */
let currentRole = 'player';

/**
 * 当前是否处于「登录」模式（false = 注册）
 * @type {boolean}
 */
let isLoginMode = true;


// ============================================================
// 二、角色 / 模式切换
// ============================================================

/**
 * 切换角色标签（游历者 / 匠师）
 * @param {'player' | 'inheritor'} role
 */
function switchRole(role) {
    currentRole = role;

    // 更新标签高亮
    document.getElementById('tab-player').classList.toggle('active', role === 'player');
    document.getElementById('tab-inheritor').classList.toggle('active', role === 'inheritor');

    _syncAuthUI();
}

/**
 * 切换登录 / 注册模式
 */
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    _syncAuthUI();
}

/**
 * 根据 currentRole + isLoginMode 同步鉴权界面文案与字段显示
 * @private
 */
function _syncAuthUI() {
    const titleEl        = document.getElementById('auth-action-title');
    const loginFields    = document.getElementById('login-fields');
    const registerFields = document.getElementById('register-fields');
    const switchText     = document.getElementById('auth-switch-text');

    if (isLoginMode) {
        titleEl.innerText = currentRole === 'player'
            ? '唤醒化身 (登录)'
            : '匠师入卷 (登录)';
        loginFields.classList.remove('hidden');
        registerFields.classList.add('hidden');
        switchText.innerText = '未有户籍？点击缔结新契约 (注册)';
    } else {
        titleEl.innerText = currentRole === 'player'
            ? '缔造化身 (注册)'
            : '开宗立派 (注册)';
        loginFields.classList.add('hidden');
        registerFields.classList.remove('hidden');
        switchText.innerText = '已有户籍？点击唤醒化身 (登录)';
    }
}


// ============================================================
// 三、表单校验
// ============================================================

/**
 * 读取当前表单中的用户名
 * 登录模式取「账号」输入框，注册模式取「用户名」输入框，
 * 若两者均为空则返回默认名。
 * @returns {string}
 */
function _resolveUsername() {
    if (isLoginMode) {
        const val = (document.getElementById('login-account')?.value || '').trim();
        return val || '佚名游侠';
    } else {
        const val = (document.getElementById('reg-username')?.value || '').trim();
        return val || '无名匠师';
    }
}

/**
 * 简单的前端校验（演示用）
 * 真实项目应替换为后端接口调用。
 * @returns {{ valid: boolean, message?: string }}
 */
function _validateForm() {
    if (!isLoginMode) {
        const username = document.getElementById('reg-username')?.value.trim();
        const password = document.querySelector('#register-fields input[type="password"]')?.value;

        if (!username) return { valid: false, message: '请为化身起个名号' };
        if (!password || password.length < 6) return { valid: false, message: '密钥至少需要 6 位' };
    }
    return { valid: true };
}


// ============================================================
// 四、登录 / 注册处理
// ============================================================

/**
 * 点击「登录 / 注册」按钮时的处理函数
 * 校验通过后执行入场动画并初始化对应角色的 UI。
 */
function handleAuth() {
    const { valid, message } = _validateForm();
    if (!valid) {
        _shakeAuthBox();
        showNotification(message, '⚠️');
        return;
    }

    const username = _resolveUsername();

    // 隐藏鉴权界面
    document.getElementById('auth-screen').classList.add('hidden');

    // 展示游戏主界面
    const appScreen = document.getElementById('app-screen');
    appScreen.style.display = 'flex';

    if (currentRole === 'player') {
        _initPlayerSession(username);
    } else {
        _initInheritorSession(username);
    }
}

/**
 * 初始化「游历者（玩家）」会话
 * @param {string} username
 * @private
 */
function _initPlayerSession(username) {
    // 显示玩家状态栏
    document.getElementById('player-stats').classList.remove('hidden');
    const inStats = document.getElementById('inheritor-stats');
    if(inStats) inStats.classList.add('hidden');

    // 显示玩家 Dock
    document.getElementById('player-dock').classList.remove('hidden');

    // 填写名字
    const nameEl = document.getElementById('display-player-name');
    if (nameEl) nameEl.innerText = username;

    // ✅ 修复白屏：每次登录强制选中并渲染大地图视图
    const firstDockItem = document.querySelector('#player-dock .dock-item:first-child');
    if(typeof switchMainView === 'function') {
        switchMainView('view-map', firstDockItem);
    }

    // 初始化各子系统数据渲染
    if(typeof updateStats === 'function') updateStats();
    if(typeof updateInventory === 'function') updateInventory();

    // 天工阁、百科、签到日历的初始化由各自模块暴露的函数负责
    if (typeof renderWorkshop      === 'function') renderWorkshop();
    if (typeof renderEncyclopedia  === 'function') renderEncyclopedia();
    if (typeof renderCheckinCalendar === 'function') renderCheckinCalendar();

    // 初始化大地图拖拽
    if (typeof initMapDrag === 'function') initMapDrag();

    //启动任务引擎
    if (typeof initQuestEngine === 'function') initQuestEngine();

    // 👇 新增这一行：启动世界时间引擎！
    if (typeof WorldTimeEngine !== 'undefined') WorldTimeEngine.start();

    // 欢迎通知
    setTimeout(() => {
        if(typeof showNotification === 'function') showNotification(`欢迎回来，${username}！开始你的九州游历吧~`, '🎉');
    }, 600);
}

/**
 * 初始化「匠师（传承人）」会话
 * @param {string} username
 * @private
 */
function _initInheritorSession(username) {
    // 显示匠师状态栏
    document.getElementById('inheritor-stats')?.classList.remove('hidden');
    document.getElementById('player-stats')?.classList.add('hidden');

    // 隐藏玩家 Dock
    document.getElementById('player-dock')?.classList.add('hidden');

    // 填写名字
    const nameEl = document.getElementById('display-inheritor-name');
    if (nameEl) nameEl.innerText = username;

    // 默认打开传承人中控台
    switchMainView('view-inheritor-dash', null);

    // 初始化匠师控制台内容
    if (typeof renderInheritorDash === 'function') renderInheritorDash();

    setTimeout(() => showNotification(`匠师 ${username}，欢迎回到工坊中控台！`, '⛩️'), 600);
}

// ============================================================
// 五、登出 (修复：确保必定回到登录界面)
// ============================================================
function logout() {
    // 隐藏游戏主界面
    const appScreen = document.getElementById('app-screen');
    if (appScreen) appScreen.style.display = 'none';

    // 清理所有激活的视图
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active-view');
        v.style.display = '';
    });

    // 隐藏所有的顶部状态栏和底部 Dock
    document.getElementById('player-stats')?.classList.add('hidden');
    document.getElementById('inheritor-stats')?.classList.add('hidden');
    document.getElementById('player-dock')?.classList.add('hidden');

    // 重置登录表单
    const loginAccount = document.getElementById('login-account');
    if (loginAccount) loginAccount.value = '';

    // 回到鉴权界面，重置为默认登录模式
    isLoginMode  = true;
    currentRole  = 'player';
    _syncAuthUI();

    // 强制显示登录框
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) {
        authScreen.classList.remove('hidden');
        authScreen.style.display = 'flex'; // 强制设置 flex 显示
    }
}

// ============================================================
// 六、UI 辅助
// ============================================================

/**
 * 登录框抖动动效（校验失败时触发）
 * @private
 */
function _shakeAuthBox() {
    const box = document.querySelector('.auth-box');
    if (!box) return;
    box.style.animation = 'shake 0.4s ease';
    box.addEventListener('animationend', () => {
        box.style.animation = 'float 6s ease-in-out infinite';
    }, { once: true });
}

/**
 * 验证码按钮倒计时（演示用）
 * 点击「获取灵符」后按钮进入 60 秒冷却。
 */
function startVerifyCountdown() {
    const btn = document.querySelector('.verify-btn');
    if (!btn || btn.disabled) return;

    let seconds = 60;
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.innerText = `${seconds}s`;

    const timer = setInterval(() => {
        seconds--;
        btn.innerText = `${seconds}s`;
        if (seconds <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerText = '获取灵符';
        }
    }, 1000);

    showNotification('灵符已发送至传音号，请注意查收', '📱');
}


// ============================================================
// 七、初始化绑定
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 确保初始 UI 状态与模块变量一致
    _syncAuthUI();

    // 验证码按钮（若存在）绑定倒计时
    const verifyBtn = document.querySelector('.verify-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', startVerifyCountdown);
    }

    // Enter 键快捷登录
    document.getElementById('auth-screen')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAuth();
    });
});

function onLoginSuccess() {
    _initStartingItems();
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'flex'; // 或 block
    document.getElementById('player-dock').classList.remove('hidden');

    SaveManager.load();
    WorldTimeEngine.start();      // ← 启动世界时钟
    initQuestEngine();            // ← 初始化任务系统
    updateStats();                // 刷新灵石显示
    updateInventory('all');       // 刷新背包
    renderQuestPanel('main');     // 渲染任务面板
}