/**
 * 🔨 造物台 · 全面升级
 * ─────────────────────────────────────────
 * 替换原有 crafting-modal 的简陋合成面板
 * 设计风格：炼器台美学 · 暗底赤金 · 沉浸感
 * ─────────────────────────────────────────
 */

(function() {
'use strict';

// ─────────────────────────────────────────
// 1. 注入 CSS
// ─────────────────────────────────────────
const CRAFTING_CSS = `
<style id="crafting-upgrade-style">

/* ── 全局弹窗层 ── */
#crafting-forge-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 8000;
    background: rgba(8, 6, 4, 0.88);
    backdrop-filter: blur(6px);
    align-items: center;
    justify-content: center;
    animation: cfForgeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
#crafting-forge-modal.open {
    display: flex;
}
@keyframes cfForgeIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
}

/* ── 主容器 ── */
.cf-shell {
    width: min(960px, 96vw);
    height: min(680px, 92vh);
    background: linear-gradient(160deg, #1a1410 0%, #120e0a 60%, #0d0a07 100%);
    border: 1px solid #5a3e1a;
    border-radius: 20px;
    box-shadow:
        0 0 0 1px #3a2a10,
        0 40px 80px rgba(0,0,0,0.9),
        inset 0 0 60px rgba(180,100,20,0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

/* ── 顶部光晕装饰 ── */
.cf-shell::before {
    content: '';
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 500px; height: 120px;
    background: radial-gradient(ellipse, rgba(212,140,30,0.18) 0%, transparent 70%);
    pointer-events: none;
}

/* ── Header ── */
.cf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 28px 14px;
    border-bottom: 1px solid rgba(140,80,20,0.35);
    background: linear-gradient(90deg, rgba(140,80,20,0.12) 0%, transparent 60%);
    flex-shrink: 0;
}
.cf-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}
.cf-header-icon {
    width: 42px; height: 42px;
    background: radial-gradient(circle at 40% 35%, #c87020, #7a3a08);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 12px rgba(200,100,20,0.4), inset 0 1px 0 rgba(255,200,80,0.3);
}
.cf-title {
    font-family: var(--font-kai, 'KaiTi', serif);
    font-size: 20px;
    color: #e8c87a;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(212,175,55,0.5);
}
.cf-subtitle {
    font-size: 11px;
    color: rgba(200,160,80,0.55);
    letter-spacing: 1.5px;
    margin-top: 2px;
}
.cf-header-right {
    display: flex;
    align-items: center;
    gap: 14px;
}
.cf-recipe-count {
    font-size: 12px;
    color: rgba(200,160,80,0.6);
    background: rgba(140,80,20,0.15);
    border: 1px solid rgba(140,80,20,0.3);
    padding: 5px 12px;
    border-radius: 20px;
}
.cf-close-btn {
    width: 32px; height: 32px;
    background: rgba(180,60,30,0.15);
    border: 1px solid rgba(180,60,30,0.3);
    border-radius: 8px;
    color: #c87060;
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
}
.cf-close-btn:hover {
    background: rgba(180,60,30,0.35);
    color: #ff8870;
}

/* ── 主体双栏 ── */
.cf-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

/* ── 左侧配方栏 ── */
.cf-sidebar {
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid rgba(140,80,20,0.25);
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,0.2);
}
.cf-sidebar-search {
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(140,80,20,0.15);
    flex-shrink: 0;
}
.cf-search-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(140,80,20,0.25);
    border-radius: 8px;
    padding: 8px 12px;
    color: #d4c090;
    font-size: 12px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
}
.cf-search-input::placeholder { color: rgba(180,140,70,0.35); }
.cf-search-input:focus { border-color: rgba(212,175,55,0.5); }

.cf-recipe-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
    scrollbar-width: thin;
    scrollbar-color: rgba(140,80,20,0.4) transparent;
}
.cf-recipe-scroll::-webkit-scrollbar { width: 4px; }
.cf-recipe-scroll::-webkit-scrollbar-track { background: transparent; }
.cf-recipe-scroll::-webkit-scrollbar-thumb { background: rgba(140,80,20,0.4); border-radius: 2px; }

.cf-category-label {
    font-size: 10px;
    color: rgba(200,160,80,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 4px 6px;
    font-family: var(--font-kai, serif);
}

/* 配方卡片 */
.cf-recipe-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 6px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.18s;
    position: relative;
    overflow: hidden;
}
.cf-recipe-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(212,175,55,0.06) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
}
.cf-recipe-card:hover::before { opacity: 1; }
.cf-recipe-card:hover {
    border-color: rgba(212,175,55,0.2);
    background: rgba(140,80,20,0.12);
}
.cf-recipe-card.active {
    border-color: rgba(212,175,55,0.5);
    background: rgba(140,80,20,0.22);
    box-shadow: 0 0 0 1px rgba(212,175,55,0.1), inset 0 0 12px rgba(212,175,55,0.06);
}
.cf-recipe-card.active::before { opacity: 1; }
.cf-recipe-card.locked {
    opacity: 0.38;
    cursor: default;
    filter: grayscale(0.7);
}
.cf-recipe-card.locked:hover {
    border-color: transparent;
    background: transparent;
}
.cf-recipe-card.locked:hover::before { opacity: 0; }

.cf-recipe-icon-wrap {
    width: 36px; height: 36px;
    background: rgba(140,80,20,0.2);
    border: 1px solid rgba(140,80,20,0.3);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cf-recipe-card.active .cf-recipe-icon-wrap {
    background: rgba(212,175,55,0.12);
    border-color: rgba(212,175,55,0.35);
    box-shadow: 0 0 8px rgba(212,175,55,0.2);
}
.cf-recipe-info { flex: 1; min-width: 0; }
.cf-recipe-name {
    font-size: 13px;
    font-weight: bold;
    color: #d4c090;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.cf-recipe-card.active .cf-recipe-name { color: #e8c87a; }
.cf-recipe-type {
    font-size: 10px;
    color: rgba(180,140,70,0.5);
    margin-top: 2px;
}
.cf-recipe-card.active .cf-recipe-type { color: rgba(212,175,55,0.6); }
.cf-lock-icon {
    font-size: 14px;
    opacity: 0.5;
}
.cf-can-craft-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #7eb6a1;
    flex-shrink: 0;
    box-shadow: 0 0 4px #7eb6a1;
}

/* ── 右侧造物台 ── */
.cf-forge {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

/* ── 空态 ── */
.cf-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(180,140,70,0.3);
    gap: 12px;
}
.cf-empty-icon {
    font-size: 56px;
    filter: grayscale(0.6);
    animation: cfFloat 4s ease-in-out infinite;
}
@keyframes cfFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
.cf-empty-text {
    font-family: var(--font-kai, serif);
    font-size: 14px;
    letter-spacing: 2px;
}

/* ── 激活态 ── */
.cf-active {
    flex: 1;
    display: none;
    flex-direction: column;
    padding: 24px 28px 20px;
    overflow-y: auto;
}
.cf-active.show { display: flex; }

/* 物品展示区 */
.cf-item-showcase {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(140,80,20,0.2);
}
.cf-item-orbit {
    position: relative;
    width: 90px; height: 90px;
    flex-shrink: 0;
}
.cf-item-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%);
    animation: cfGlowPulse 2.5s ease-in-out infinite;
}
@keyframes cfGlowPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
}
.cf-item-ring {
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    border: 1.5px dashed rgba(212,175,55,0.25);
    animation: cfSpin 8s linear infinite;
}
@keyframes cfSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
.cf-item-main-icon {
    position: absolute;
    inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 52px;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}
.cf-item-meta { flex: 1; }
.cf-item-name {
    font-family: var(--font-kai, serif);
    font-size: 20px;
    color: #e8c87a;
    letter-spacing: 2px;
    margin-bottom: 5px;
}
.cf-item-type-tag {
    display: inline-block;
    font-size: 11px;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(126,182,161,0.12);
    border: 1px solid rgba(126,182,161,0.3);
    color: #7eb6a1;
    margin-bottom: 8px;
}
.cf-item-desc {
    font-size: 12px;
    color: rgba(200,170,100,0.6);
    line-height: 1.7;
    font-family: var(--font-kai, serif);
}

/* 材料区 */
.cf-mat-section-title {
    font-size: 11px;
    color: rgba(200,160,80,0.45);
    letter-spacing: 2px;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
}
.cf-mat-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(140,80,20,0.3), transparent);
}

.cf-mat-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.cf-mat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 12px 14px;
    border-radius: 12px;
    min-width: 80px;
    position: relative;
    transition: transform 0.2s;
}
.cf-mat-card:hover { transform: translateY(-2px); }
.cf-mat-card.enough {
    background: rgba(212,175,55,0.07);
    border: 1px solid rgba(212,175,55,0.25);
}
.cf-mat-card.lacking {
    background: rgba(180,60,30,0.07);
    border: 1px solid rgba(180,60,30,0.3);
}
.cf-mat-icon {
    font-size: 26px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
}
.cf-mat-name {
    font-size: 11px;
    color: rgba(200,170,100,0.8);
    text-align: center;
    max-width: 72px;
    line-height: 1.3;
}
.cf-mat-count {
    font-size: 12px;
    font-weight: bold;
}
.cf-mat-card.enough .cf-mat-count { color: #7eb6a1; }
.cf-mat-card.lacking .cf-mat-count { color: #d46060; }
.cf-mat-card.lacking::after {
    content: '不足';
    position: absolute;
    top: -6px; right: -6px;
    font-size: 9px;
    background: #d46060;
    color: white;
    padding: 1px 5px;
    border-radius: 4px;
}

/* 合成按钮区 */
.cf-action-area {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 进度条 */
.cf-progress-wrap {
    display: none;
    flex-direction: column;
    gap: 6px;
}
.cf-progress-wrap.show { display: flex; }
.cf-progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(200,160,80,0.5);
}
.cf-progress-track {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(140,80,20,0.2);
}
.cf-progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #c87020, #e8a840, #f5c842);
    border-radius: 4px;
    transition: width 0.06s linear;
    position: relative;
    box-shadow: 0 0 8px rgba(232,168,64,0.5);
}
.cf-progress-fill::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent, rgba(255,220,120,0.6));
    border-radius: 4px;
}

/* 造物按钮 */
.cf-btn-craft {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-family: var(--font-kai, serif);
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.22s;
    position: relative;
    overflow: hidden;
}
.cf-btn-craft.ready {
    background: linear-gradient(135deg, #c87020 0%, #e8a840 50%, #d48820 100%);
    color: #1a0e00;
    font-weight: bold;
    box-shadow: 0 6px 20px rgba(200,120,32,0.4), inset 0 1px 0 rgba(255,220,120,0.4);
}
.cf-btn-craft.ready:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(200,120,32,0.55), inset 0 1px 0 rgba(255,220,120,0.4);
}
.cf-btn-craft.ready:active { transform: translateY(0); }
.cf-btn-craft.ready::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
}
.cf-btn-craft.disabled {
    background: rgba(80,60,40,0.4);
    color: rgba(180,150,100,0.35);
    cursor: not-allowed;
    border: 1px solid rgba(80,60,40,0.3);
}
.cf-btn-craft.working {
    background: rgba(80,60,40,0.4);
    color: rgba(212,175,55,0.6);
    cursor: not-allowed;
}

/* ── 爆炸特效 Overlay ── */
.cf-fx-overlay {
    position: absolute;
    inset: 0;
    background: rgba(8,5,2,0.92);
    z-index: 10;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
}
.cf-fx-overlay.show { display: flex; }
.cf-fx-burst {
    font-size: 72px;
    animation: cfBurst 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    filter: drop-shadow(0 0 20px rgba(212,175,55,0.8));
}
@keyframes cfBurst {
    0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
    60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
}
.cf-fx-title {
    font-family: var(--font-kai, serif);
    font-size: 22px;
    color: #e8c87a;
    letter-spacing: 4px;
    animation: cfFadeUp 0.5s 0.3s ease both;
}
.cf-fx-result-name {
    font-size: 16px;
    color: rgba(212,175,55,0.7);
    letter-spacing: 2px;
    animation: cfFadeUp 0.5s 0.5s ease both;
}
@keyframes cfFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* 粒子 */
.cf-particle {
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    animation: cfParticle var(--dur, 1.2s) ease-out var(--delay, 0s) both;
}
@keyframes cfParticle {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx,0), var(--ty,-60px)) scale(0); opacity: 0; }
}

/* ── 底部状态栏 ── */
.cf-footer {
    padding: 10px 28px;
    border-top: 1px solid rgba(140,80,20,0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: rgba(0,0,0,0.15);
}
.cf-footer-tip {
    font-size: 11px;
    color: rgba(180,140,60,0.4);
    font-family: var(--font-kai, serif);
    letter-spacing: 1px;
}
.cf-footer-stones {
    font-size: 12px;
    color: rgba(212,175,55,0.55);
    display: flex;
    align-items: center;
    gap: 5px;
}

/* 亮度动效 */
@keyframes cfShimmer {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
}

</style>
`;

// ─────────────────────────────────────────
// 2. 注入 HTML
// ─────────────────────────────────────────
const CRAFTING_HTML = `
<div id="crafting-forge-modal">
    <div class="cf-shell">

        <!-- Header -->
        <div class="cf-header">
            <div class="cf-header-left">
                <div class="cf-header-icon">🔨</div>
                <div>
                    <div class="cf-title">天工造物</div>
                    <div class="cf-subtitle">— 匠心铸物，百工归宗 —</div>
                </div>
            </div>
            <div class="cf-header-right">
                <div class="cf-recipe-count" id="cf-recipe-count">图谱 0 / 0</div>
                <button class="cf-close-btn" onclick="window._cfClose()">×</button>
            </div>
        </div>

        <!-- Body -->
        <div class="cf-body">

            <!-- 左栏：配方列表 -->
            <div class="cf-sidebar">
                <div class="cf-sidebar-search">
                    <input class="cf-search-input" id="cf-search" placeholder="🔍  搜索图谱名称..." oninput="window._cfSearch(this.value)">
                </div>
                <div class="cf-recipe-scroll" id="cf-recipe-list"></div>
            </div>

            <!-- 右侧：炼器台 -->
            <div class="cf-forge">

                <!-- 空态 -->
                <div class="cf-empty" id="cf-empty">
                    <div class="cf-empty-icon">⚖️</div>
                    <div class="cf-empty-text">从左侧选取图谱，开始造物</div>
                </div>

                <!-- 激活态 -->
                <div class="cf-active" id="cf-active">
                    <!-- 物品展示 -->
                    <div class="cf-item-showcase">
                        <div class="cf-item-orbit">
                            <div class="cf-item-glow"></div>
                            <div class="cf-item-ring"></div>
                            <div class="cf-item-main-icon" id="cf-item-icon">🛠️</div>
                        </div>
                        <div class="cf-item-meta">
                            <div class="cf-item-name" id="cf-item-name">—</div>
                            <div class="cf-item-type-tag" id="cf-item-type">—</div>
                            <div class="cf-item-desc" id="cf-item-desc">—</div>
                        </div>
                    </div>

                    <!-- 材料 -->
                    <div class="cf-mat-section-title">📦 所需材料</div>
                    <div class="cf-mat-grid" id="cf-mat-grid"></div>

                    <!-- 操作区 -->
                    <div class="cf-action-area">
                        <div class="cf-progress-wrap" id="cf-progress-wrap">
                            <div class="cf-progress-label">
                                <span>🔥 天工炼器中...</span>
                                <span id="cf-progress-pct">0%</span>
                            </div>
                            <div class="cf-progress-track">
                                <div class="cf-progress-fill" id="cf-progress-fill"></div>
                            </div>
                        </div>
                        <button class="cf-btn-craft disabled" id="cf-btn-craft" onclick="window._cfExecute()">
                            准备就绪
                        </button>
                    </div>
                </div>

                <!-- 爆炸特效 Overlay -->
                <div class="cf-fx-overlay" id="cf-fx-overlay">
                    <div class="cf-fx-burst" id="cf-fx-burst">✨</div>
                    <div class="cf-fx-title">天工开物</div>
                    <div class="cf-fx-result-name" id="cf-fx-result-name"></div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="cf-footer">
            <div class="cf-footer-tip" id="cf-footer-tip">选择一份图谱，凝神注灵</div>
            <div class="cf-footer-stones">💎 灵石 <span id="cf-stones-val">—</span></div>
        </div>
    </div>
</div>
`;

// ─────────────────────────────────────────
// 3. 注入 DOM
// ─────────────────────────────────────────
function _injectUI() {
    if (document.getElementById('crafting-forge-modal')) return;
    document.head.insertAdjacentHTML('beforeend', CRAFTING_CSS);
    document.body.insertAdjacentHTML('beforeend', CRAFTING_HTML);
}

// ─────────────────────────────────────────
// 4. 状态
// ─────────────────────────────────────────
let _currentRecipeId = null;
let _isWorking = false;
let _allRecipes = [];
let _searchStr = '';

// ─────────────────────────────────────────
// 5. 核心：渲染左侧列表
// ─────────────────────────────────────────
function _renderRecipeList() {
    if (typeof CRAFTING_RECIPES === 'undefined') return;
    _allRecipes = CRAFTING_RECIPES;

    const inv = (typeof gameState !== 'undefined' && gameState.inventory) ? gameState.inventory : {};
    const unlocked = (typeof gameState !== 'undefined' && gameState.unlockedRecipes) ? gameState.unlockedRecipes : [];

    const query = _searchStr.toLowerCase();

    // 分组
    const groups = {};
    _allRecipes.forEach(r => {
        if (query && !r.name.includes(query) && !r.type.includes(query)) return;
        const cat = r.type || '其他';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(r);
    });

    const listEl = document.getElementById('cf-recipe-list');
    if (!listEl) return;

    let html = '';
    for (const [cat, recipes] of Object.entries(groups)) {
        html += `<div class="cf-category-label">${cat}</div>`;
        recipes.forEach(r => {
            const isUnlocked = r.defaultUnlocked || unlocked.includes(r.id);
            if (!isUnlocked) {
                html += `
                <div class="cf-recipe-card locked">
                    <div class="cf-recipe-icon-wrap">🔒</div>
                    <div class="cf-recipe-info">
                        <div class="cf-recipe-name">未知图谱</div>
                        <div class="cf-recipe-type">需机缘解锁</div>
                    </div>
                </div>`;
                return;
            }
            // 检查材料是否足够
            let canCraft = true;
            for (const [mat, need] of Object.entries(r.reqs)) {
                if ((inv[mat] || 0) < need) { canCraft = false; break; }
            }
            const isActive = _currentRecipeId === r.id;
            html += `
            <div class="cf-recipe-card ${isActive ? 'active' : ''}" onclick="window._cfSelectRecipe('${r.id}')">
                <div class="cf-recipe-icon-wrap">${r.icon}</div>
                <div class="cf-recipe-info">
                    <div class="cf-recipe-name">${r.name}</div>
                    <div class="cf-recipe-type">${r.type}</div>
                </div>
                ${canCraft ? '<div class="cf-can-craft-dot" title="材料充足"></div>' : ''}
            </div>`;
        });
    }

    if (!html) {
        html = `<div style="color:rgba(180,140,70,0.3); font-size:12px; text-align:center; padding:20px; font-family:var(--font-kai,serif);">未找到相关图谱</div>`;
    }

    listEl.innerHTML = html;

    // 更新总数
    const totalUnlocked = _allRecipes.filter(r => r.defaultUnlocked || unlocked.includes(r.id)).length;
    const countEl = document.getElementById('cf-recipe-count');
    if (countEl) countEl.textContent = `图谱 ${totalUnlocked} / ${_allRecipes.length}`;
}

// ─────────────────────────────────────────
// 6. 选中配方：渲染右侧
// ─────────────────────────────────────────
window._cfSelectRecipe = function(recipeId) {
    if (_isWorking) return;
    _currentRecipeId = recipeId;
    _renderRecipeList(); // 刷新高亮

    const recipe = _allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const inv = (typeof gameState !== 'undefined' && gameState.inventory) ? gameState.inventory : {};

    // 显示区块
    document.getElementById('cf-empty').style.display = 'none';
    document.getElementById('cf-active').classList.add('show');

    // 物品信息
    document.getElementById('cf-item-icon').textContent = recipe.icon;
    document.getElementById('cf-item-name').textContent = recipe.name;
    document.getElementById('cf-item-type').textContent = recipe.type;
    document.getElementById('cf-item-desc').textContent = recipe.desc;

    // 材料卡片
    let matHtml = '';
    let canCraft = true;
    for (const [mat, need] of Object.entries(recipe.reqs)) {
        const have = inv[mat] || 0;
        const ok = have >= need;
        if (!ok) canCraft = false;
        // 尝试从 itemDatabase 获取 icon
        let matIcon = '📦';
        if (typeof itemDatabase !== 'undefined' && itemDatabase[mat]) {
            matIcon = itemDatabase[mat].icon || '📦';
        }
        matHtml += `
        <div class="cf-mat-card ${ok ? 'enough' : 'lacking'}">
            <div class="cf-mat-icon">${matIcon}</div>
            <div class="cf-mat-name">${mat}</div>
            <div class="cf-mat-count">${have} / ${need}</div>
        </div>`;
    }
    document.getElementById('cf-mat-grid').innerHTML = matHtml;

    // 按钮状态
    const btn = document.getElementById('cf-btn-craft');
    if (canCraft) {
        btn.className = 'cf-btn-craft ready';
        btn.textContent = `✨ 注入灵力 · 立即造物`;
    } else {
        btn.className = 'cf-btn-craft disabled';
        btn.textContent = '材料不足，无法造物';
    }

    // 底部提示
    const tipEl = document.getElementById('cf-footer-tip');
    if (tipEl) {
        tipEl.textContent = canCraft
            ? `可造物：${recipe.name} · 点击注入灵力即可开始`
            : `材料尚缺，需前往九州大地搜集`;
    }
};

// ─────────────────────────────────────────
// 7. 执行造物
// ─────────────────────────────────────────
window._cfExecute = function() {
    if (_isWorking || !_currentRecipeId) return;
    const recipe = _allRecipes.find(r => r.id === _currentRecipeId);
    if (!recipe) return;

    const inv = (typeof gameState !== 'undefined' && gameState.inventory) ? gameState.inventory : {};
    for (const [mat, need] of Object.entries(recipe.reqs)) {
        if ((inv[mat] || 0) < need) return;
    }

    // 扣材料
    for (const [mat, need] of Object.entries(recipe.reqs)) {
        gameState.inventory[mat] = (gameState.inventory[mat] || 0) - need;
    }
    if (typeof updateInventory === 'function') updateInventory();

    _isWorking = true;
    const btn = document.getElementById('cf-btn-craft');
    btn.className = 'cf-btn-craft working';
    btn.textContent = '天工炼器中...';

    // 进度条
    const progressWrap = document.getElementById('cf-progress-wrap');
    const fill = document.getElementById('cf-progress-fill');
    const pctEl = document.getElementById('cf-progress-pct');
    progressWrap.classList.add('show');
    fill.style.width = '0%';

    if (typeof playSound === 'function') playSound('magic');

    const timeCost = recipe.timeCost || 2000;
    const interval = 50;
    const step = (interval / timeCost) * 100;
    let progress = 0;

    const timer = setInterval(() => {
        progress = Math.min(progress + step, 100);
        fill.style.width = `${progress}%`;
        if (pctEl) pctEl.textContent = `${Math.round(progress)}%`;

        if (progress >= 100) {
            clearInterval(timer);
            _showCraftResult(recipe);
        }
    }, interval);
};

// ─────────────────────────────────────────
// 8. 展示结果特效
// ─────────────────────────────────────────
function _showCraftResult(recipe) {
    const overlay = document.getElementById('cf-fx-overlay');
    const burstEl = document.getElementById('cf-fx-burst');
    const resultEl = document.getElementById('cf-fx-result-name');

    burstEl.textContent = recipe.icon;
    resultEl.textContent = `【 ${recipe.name} 】`;
    overlay.classList.add('show');

    // 生成粒子
    _spawnParticles(overlay, recipe.icon);

    if (typeof playSound === 'function') playSound('achievement');

    setTimeout(() => {
        overlay.classList.remove('show');

        // 给物品
        if (typeof addItem === 'function') {
            addItem(recipe.name, 1);
        } else {
            if (typeof gameState !== 'undefined') {
                if (!gameState.inventory) gameState.inventory = {};
                gameState.inventory[recipe.name] = (gameState.inventory[recipe.name] || 0) + 1;
            }
        }

        // 解锁图鉴
        if (recipe.compendium && typeof gameState !== 'undefined') {
            if (!gameState.unlockedCompendium) gameState.unlockedCompendium = [];
            if (!gameState.unlockedCompendium.includes(recipe.name)) {
                gameState.unlockedCompendium.push(recipe.name);
                if (typeof earnStones === 'function' && recipe.compendium.reward) {
                    earnStones(recipe.compendium.reward);
                }
            }
        }

        // 传习录
        if (typeof _appendXiulilu === 'function') {
            _appendXiulilu({
                type: 'craft',
                icon: recipe.icon,
                title: `造物成功：【${recipe.name}】`,
                desc: recipe.desc
            });
        }

        if (typeof showNotification === 'function') {
            showNotification(`天工开物！获得【${recipe.name}】`, recipe.icon);
        }

        if (typeof SaveManager !== 'undefined') SaveManager.save();

        // 收尾
        _isWorking = false;
        const progressWrap = document.getElementById('cf-progress-wrap');
        if (progressWrap) progressWrap.classList.remove('show');
        const fill = document.getElementById('cf-progress-fill');
        if (fill) fill.style.width = '0%';

        // 刷新整个面板
        _renderRecipeList();
        window._cfSelectRecipe(_currentRecipeId);
        _refreshStones();

    }, 1600);
}

// ─────────────────────────────────────────
// 9. 粒子爆炸
// ─────────────────────────────────────────
function _spawnParticles(container, icon) {
    const colors = ['#e8c87a', '#f5d060', '#c87020', '#7eb6a1', '#ffffff'];
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'cf-particle';
        const size = 4 + Math.random() * 6;
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.5;
        const dist = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 30;
        p.style.cssText = `
            width: ${size}px; height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%; top: 50%;
            margin-left: -${size/2}px; margin-top: -${size/2}px;
            --tx: ${tx}px; --ty: ${ty}px;
            --dur: ${0.8 + Math.random() * 0.6}s;
            --delay: ${Math.random() * 0.2}s;
        `;
        container.appendChild(p);
        setTimeout(() => p.remove(), 1600);
    }
}

// ─────────────────────────────────────────
// 10. 工具
// ─────────────────────────────────────────
window._cfSearch = function(val) {
    _searchStr = val;
    _renderRecipeList();
};

window._cfClose = function() {
    const modal = document.getElementById('crafting-forge-modal');
    if (modal) modal.classList.remove('open');
    _isWorking = false;
    _currentRecipeId = null;
};

function _refreshStones() {
    const el = document.getElementById('cf-stones-val');
    if (!el) return;
    const stones = (typeof gameState !== 'undefined' && gameState.lingshi !== undefined)
        ? gameState.lingshi
        : (typeof gameState !== 'undefined' ? (gameState.stones || 0) : 0);
    el.textContent = stones;
}

// ─────────────────────────────────────────
// 11. 主入口 — 覆盖 openCrafting
// ─────────────────────────────────────────
window.openCrafting = function() {
    _injectUI();

    // 兼容旧接口：如果 station-hub-modal 存在，关掉它
    if (typeof closeModal === 'function') {
        closeModal('crafting-modal');
        closeModal('station-hub-modal');
        closeModal('station-work-modal');
    }

    _currentRecipeId = null;
    _isWorking = false;
    _searchStr = '';

    // 初始化 gameState 容错
    if (typeof _initCraftingState === 'function') _initCraftingState();

    const searchEl = document.getElementById('cf-search');
    if (searchEl) searchEl.value = '';

    // 隐藏激活态，显示空态
    const emptyEl = document.getElementById('cf-empty');
    const activeEl = document.getElementById('cf-active');
    if (emptyEl) emptyEl.style.display = '';
    if (activeEl) activeEl.classList.remove('show');

    const progressWrap = document.getElementById('cf-progress-wrap');
    if (progressWrap) progressWrap.classList.remove('show');
    const fill = document.getElementById('cf-progress-fill');
    if (fill) fill.style.width = '0%';

    _renderRecipeList();
    _refreshStones();

    const modal = document.getElementById('crafting-forge-modal');
    if (modal) modal.classList.add('open');

    if (typeof playSound === 'function') playSound('click');
};

// openCraftingHub 兼容别名
window.openCraftingHub = window.openCrafting;

console.log('✅ 造物台升级版已加载');

})();
