require('dotenv').config();
const { Web3 } = require('web3');

// Khởi tạo Web3 với nhà cung cấp HTTP
const web3 = new Web3(process.env.INFURA_URL);

// Tạo một tài khoản từ khóa bí mật
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

// Thêm tài khoản vào Web3 
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// ABI của hợp đồng thông minh
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			}
		],
		"name": "addCertificateDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificateKeys",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "certificateHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "organizationName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "organizationName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "certificateId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			}
		],
		"name": "createCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			}
		],
		"name": "getCertificatesByStudentId",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "courseId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "certificateHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "certificateId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "score",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "organizationName",
						"type": "string"
					}
				],
				"internalType": "struct CoursePayment.Certificate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "page",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pageSize",
				"type": "uint256"
			}
		],
		"name": "getCertificatesWithPagination",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "courseId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "certificateHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "certificateId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imageUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "score",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "organizationName",
						"type": "string"
					}
				],
				"internalType": "struct CoursePayment.Certificate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalCertificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "courseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "organization",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "organizationName",
				"type": "string"
			}
		],
		"name": "payForCourse",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract };