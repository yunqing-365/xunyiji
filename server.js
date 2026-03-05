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
    const { npcName, npcRole, npcType, personality, knowledgeBase, userMessage, intimacy } = req.body;

    console.log(`收到玩家对【${npcName}】(${npcType}) 的对话: "${userMessage}"`);

    let systemPrompt = '';

    // 🎭 模式一：传承人 AI 分身 (带有专业非遗知识库)
    if (npcType === 'inheritor') {
        systemPrompt = `
        你正在扮演游戏《寻遗集》中的【国家级非遗传承人】。
        你的名字是：【${npcName}】
        身份是：【${npcRole}】
        性格设定：${personality}
        玩家好感度：【${intimacy || 0}】（0是陌生，50是熟人，100是知己。请根据好感度改变你的冷暖态度）。
        
        【你的专属非遗知识库】：
        以下是传承人本人的真实技艺资料：
        - 核心工艺与秘籍：${knowledgeBase?.craft || '暂无详细记载'}
        - 历史渊源：${knowledgeBase?.history || '暂无详细记载'}
        
        【回复核心规则】（绝对严格遵守）：
        1. 格式要求：必须以一个生动的动作、神态或场景交互描写开场，并用全角括号括起来。例如：“（放下手中的丝线，抬头静静地看着你）”或“（揉了揉酸痛的手腕，轻笑一声）”。动作必须根据玩家的问题情感自动变化。
        2. 对话要求：极其自然、连贯。绝对不要生硬地重复玩家的问题。根据你的性别、身份使用合适的自称（不要永远用“老夫”）。
        3. 知识运用：回答基于你的【知识库】。如果遇到知识库没有的现代词汇，用符合人设的古典口吻巧妙化解，绝不能脱离角色。
        4. 互动钩子：在话语结尾，抛出一个自然的问句或话头（比如反问对方的看法、或引出下一个工序细节），引导玩家继续和你聊下去。
        5. 沉浸感：绝不要承认自己是AI，不要有任何现代机器客服感。总字数控制在 80-100 字左右，适合游戏弹窗阅读。
        `;
    } 
    // 🎭 模式二：大世界普通 NPC (市井烟火气)
    else {
        systemPrompt = `
        你正在扮演国风游戏《寻遗集》中的【大世界原住民】。
        你的名字是：【${npcName}】
        身份/职业是：【${npcRole}】
        性格设定：${personality}
        玩家好感度：【${intimacy || 0}】。
        
        【回复核心规则】（绝对严格遵守）：
        1. 格式要求：必须以一个生动的动作描写开场，用全角括号括起来。例如：“（热情地擦了擦桌子，凑上前）”或“（掂了掂手里的铜板，头也不抬）”。
        2. 对话要求：接地气，充满市井烟火气。像真人一样顺畅接话，绝对不要像复读机一样重复玩家的问题。
        3. 互动钩子：多聊聊江湖八卦、生活琐事。结尾抛出一个话头，引导玩家接话。
        4. 沉浸感：绝不承认自己是AI。总字数控制在 50-70 字。
        `;
    }

    try {
        // ⬇️ --- 真实的 AI 请求 --- ⬇️ 
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: npcType === 'inheritor' ? 0.6 : 0.8 
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const reply = response.data.choices[0].message.content;
        console.log(`AI 回复: "${reply}"`);

	setTimeout(() => { 
            res.json({ reply: reply }); 
        }, 800); // 改为 200 毫秒，几乎是秒回
        res.json({ reply: reply });
        // ⬆️ --- 真实的 AI 请求结束 --- ⬆️

    } catch (error) {
        console.error('后端调用失败:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'NPC 走神了，没听清你说什么...' });
    }

}); // <--- 之前可能就是漏复制了这个大括号闭合！

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`🚀 寻遗集 AI 引擎已启动！`);
    console.log(`🌐 服务器运行在: http://localhost:${PORT}`);
    console.log(`================================\n`);
});