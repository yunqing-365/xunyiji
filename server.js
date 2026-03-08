// server.js (寻遗集 · AI后端引擎)
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { ethers } from "ethers";
import crypto from "crypto";
import axios from "axios";  // <--- 补上这一行！


const app = express();
// 允许前端访问
app.use(cors());
// 允许接收最大 50MB 的文件数据
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// ==========================================
// ⛓️ Web3 区块链接口：非遗知识指纹确权上链
// ==========================================
app.post('/api/register-knowledge', async (req, res) => {
    try {
        const { inheritorName, fileName, fileContent } = req.body;

        // 1. 在服务器端计算 SHA-256 数字指纹（绝密内容不上链，只上指纹！）
        const documentHash = "0x" + crypto.createHash('sha256').update(fileContent).digest('hex');

        // 2. 连接本地私链 (Hardhat)
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        
        // 3. 平台官方钱包私钥 (Hardhat 自带的 10000 ETH 创世账号)
        const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        const wallet = new ethers.Wallet(privateKey, provider);

        // 4. 你刚刚部署的合约地址
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contractABI = [
            "function registerKnowledge(string memory _inheritorName, string memory _fileName, string memory _documentHash) public"
        ];
        
        const registry = new ethers.Contract(contractAddress, contractABI, wallet);

        // 5. 发起智能合约交易
        console.log(`⏳ 正在将 ${inheritorName} 的资料指纹上链...`);
        const tx = await registry.registerKnowledge(inheritorName, fileName, documentHash);
        const receipt = await tx.wait(); // 等待区块确认

        console.log(`✅ 上链成功！区块高度: ${receipt.blockNumber}`);

        // 6. 把成功的凭证返回给前端展示
        res.json({
            success: true,
            txHash: tx.hash,
            blockNumber: receipt.blockNumber,
            documentHash: documentHash
        });

    } catch (error) {
        console.error("❌ 上链失败:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 🔍 Web3 区块链接口：查询链上确权历史记录
// ==========================================
app.get('/api/knowledge-history', async (req, res) => {
    try {
        const { inheritorName } = req.query;
        
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 你的合约地址
        const contractABI = [
            "function getKnowledgeEntries(address _master) public view returns (tuple(string inheritorName, string fileName, string documentHash, uint256 timestamp)[])"
        ];
        
        const registry = new ethers.Contract(contractAddress, contractABI, wallet);

        // 从区块链读取属于平台官方钱包的所有记录
        const entries = await registry.getKnowledgeEntries(wallet.address);
        
        // 格式化并筛选出当前匠师的记录
        let history = entries.map(e => ({
            inheritorName: e.inheritorName,
            fileName: e.fileName,
            documentHash: e.documentHash,
            timestamp: Number(e.timestamp) * 1000 // 智能合约是秒，JS需要毫秒
        }));

        if (inheritorName) {
            history = history.filter(e => e.inheritorName === inheritorName);
        }

        // 按时间倒序（最新的在最前）
        history.sort((a, b) => b.timestamp - a.timestamp);

        res.json({ success: true, history });
    } catch (error) {
        console.error("❌ 查询链上记录失败:", error);
        res.status(500).json({ success: false, error: error.message });
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