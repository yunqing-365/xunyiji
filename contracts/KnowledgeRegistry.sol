// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;



contract KnowledgeRegistry {

    // 事件：记录知识确权的关键信息，前端可监听此事件获取交易记录

    event KnowledgeRegistered(

        address indexed masterAddress,  // 匠师的钱包地址

        string inheritorName,           // 传承人名称

        string fileName,                // 资料/典籍名称 (新增)

        string documentHash,            // 资料的SHA-256数字指纹（Hash）

        uint256 timestamp               // 上链时间戳（不可篡改）

    );



    // 结构体：存储每条知识的确权信息

    struct KnowledgeEntry {

        string inheritorName;

        string fileName;                // 资料/典籍名称 (新增)

        string documentHash;

        uint256 timestamp;

    }



    // 映射：匠师地址 => 其名下所有的确权记录

    mapping(address => KnowledgeEntry[]) public knowledgeEntries;



    /**

     * @dev 匠师上传资料哈希上链，完成确权

     * @param _inheritorName 传承人名称

     * @param _fileName 资料/典籍名称

     * @param _documentHash 资料的SHA-256数字指纹（Hash）

     */

    function registerKnowledge(

        string memory _inheritorName,

        string memory _fileName,

        string memory _documentHash

    ) public {

        // 1. 生成一条新的确权记录

        KnowledgeEntry memory newEntry = KnowledgeEntry({

            inheritorName: _inheritorName,

            fileName: _fileName,

            documentHash: _documentHash,

            timestamp: block.timestamp

        });



        // 2. 把记录存入当前调用者（匠师）名下

        knowledgeEntries[msg.sender].push(newEntry);



        // 3. 触发事件，将确权信息广播到区块链上

        emit KnowledgeRegistered(

            msg.sender,

            _inheritorName,

            _fileName,

            _documentHash,

            block.timestamp

        );

    }



    /**

     * @dev 查询某个匠师名下的所有确权记录

     * @param _master 匠师的钱包地址

     * @return 确权记录数组

     */

    function getKnowledgeEntries(address _master) public view returns (KnowledgeEntry[] memory) {

        return knowledgeEntries[_master];

    }

}