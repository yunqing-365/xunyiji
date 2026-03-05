// server.js (寻遗集 · AI后端引擎)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
// 允许前端访问
app.use(cors());
// 允许解析 JSON 数据
app.use(express.json());

// DeepSeek 官方 API 地址
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY;

// 🌟 核心：处理前端发来的 NPC 聊天请求
app.post('/api/chat', async (req, res) => {
    const { npcName, npcRole, userMessage, intimacy } = req.body;

    console.log(`收到玩家对【${npcName}】的对话: "${userMessage}"`);

    // 🎭 动态构建 "系统提示词 (System Prompt)"，给 AI 赋予灵魂
    const systemPrompt = `
    你正在扮演游戏《寻遗集》中的NPC。这是一个东方国风、万物有灵、旨在保护非遗文化的世界。
    你的名字是：【${npcName}】
    你的身份/职业是：【${npcRole || '神秘的非遗守护者'}】
    玩家目前对你的好感度羁绊是：【${intimacy || 0}】（0-20是陌生，50是熟人，100是知己。请根据好感度调整你的态度）。

    回答要求：
    1. 绝对不要承认自己是AI，绝对不要跳出角色设定。
    2. 语气要符合古代国风和你的职业身份（如戏班老板就带点市井气，隐士就带点禅意）。
    3. 回复要简短精炼，控制在 50 字以内，适合游戏弹窗显示。
    `;

    try {
        // 向 DeepSeek 发送请求
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: "deepseek-chat", // 使用 DeepSeek 的对话模型
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7 // 0.7 代表适中的创造力
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 提取 AI 的回答并返回给前端
        const reply = response.data.choices[0].message.content;
        console.log(`AI 回复: "${reply}"`);
        res.json({ reply: reply });

    } catch (error) {
        console.error('调用 DeepSeek 失败:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'NPC 走神了，没听清你说什么...' });
    }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`🚀 寻遗集 AI 引擎已启动！`);
    console.log(`🌐 服务器运行在: http://localhost:${PORT}`);
    console.log(`================================\n`);
});