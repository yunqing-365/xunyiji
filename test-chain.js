import { ethers } from "ethers";
import crypto from "crypto";

async function main() {
    console.log("🚀 开始执行非遗资料【数字指纹】确权上链流程...\n");

    // 1. 连接到你刚才启动的本地私链
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // 2. 使用 Hardhat 提供的默认测试账号 #0 的私钥 (自带 10000 ETH)
    // 这是开发专用的“上帝钥匙”，千万别用在真实主网上！
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(privateKey, provider);

    // 3. 填入你刚刚新鲜出炉的合约地址！
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // 4. 合约的 ABI（接口说明书，告诉 JS 怎么和合约沟通）
    const contractABI = [
        "function registerKnowledge(string memory _inheritorName, string memory _fileName, string memory _documentHash) public",
        "function getKnowledgeEntries(address _master) public view returns (tuple(string inheritorName, string fileName, string documentHash, uint256 timestamp)[])"
    ];

    // 5. 实例化合约对象
    const knowledgeRegistry = new ethers.Contract(contractAddress, contractABI, wallet);

    // ==========================================
    // 🎭 模拟场景：传承人上传绝密配方
    // ==========================================
    const inheritorName = "张景春大师";
    const fileName = "南宋冰裂纹绝密配方.pdf";
    const fileContent = "高岭土30%, 石英20%, 长石50%, 加上一滴神秘的深海渊水..."; // 模拟文件里的绝密文字

    console.log(`📄 正在为文件 [${fileName}] 提取唯一的数字指纹 (SHA-256)...`);
    const documentHash = "0x" + crypto.createHash('sha256').update(fileContent).digest('hex');
    console.log(`✅ 生成指纹: ${documentHash}\n`);

    // ==========================================
    // ⛓️ 核心动作：发起区块链交易
    // ==========================================
    console.log("⏳ 正在向区块链发送确权交易，请稍候...");
    const tx = await knowledgeRegistry.registerKnowledge(inheritorName, fileName, documentHash);

    console.log(`🚀 交易已发送！交易凭证(TxHash): ${tx.hash}`);
    const receipt = await tx.wait(); // 等待区块打包确认

    console.log(`🎉 确权成功！数据已永久刻入区块链！`);
    console.log(`📦 被打包在第 [${receipt.blockNumber}] 号区块中\n`);

    // ==========================================
    // 🔍 验证：从区块链上把数据读出来
    // ==========================================
    console.log("==========================================");
    console.log("🔍 正在从区块链上读取该大师的所有确权记录...");
    const entries = await knowledgeRegistry.getKnowledgeEntries(wallet.address);
    
    console.log("📜 链上不可篡改的记录如下：");
    entries.forEach((entry, index) => {
        console.log(`   👉 记录 ${index + 1}:`);
        console.log(`      - 传承人: ${entry.inheritorName}`);
        console.log(`      - 文件名: ${entry.fileName}`);
        console.log(`      - 数字指纹: ${entry.documentHash}`);
        console.log(`      - 确权时间: ${new Date(Number(entry.timestamp) * 1000).toLocaleString()}`);
    });
    console.log("==========================================");
}

main().catch(console.error);