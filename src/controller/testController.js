const Test = require("../models/Test");

class TestController {
    // Tạo một bài test mới
    async create(req, res) {
        const { title, description, organization, price, passingScore, questions, image } = req.body;

        try {
            const test = new Test({
                title,
                description,
                organization,
                price,
                passingScore,
                questions,
                image // Thêm trường ảnh
            });

            const savedTest = await test.save();
            res.status(201).json(savedTest);
        } catch (error) {
            res.status(400).json({ message: "Error creating test", error });
        }
    }

    // Đọc thông tin về một bài test theo ID
    async getById(req, res) {
        try {
            const test = await Test.findById(req.params.id).populate("organization");
            if (!test) {
                return res.status(404).json({ message: "Test not found" });
            }
            res.status(200).json(test);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test", error });
        }
    }

    // Đọc tất cả các bài test
    async getAll(req, res) {
        try {
            // Chọn tất cả các trường trừ trường 'questions'
            const tests = await Test.find().select('-questions').populate("organization");
            res.status(200).json(tests);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving tests", error });
        }
    }

    // Chỉnh sửa một bài test theo ID
    async update(req, res) {
        const { title, description, organization, price, passingScore, questions, image } = req.body;

        try {
            const updatedTest = await Test.findByIdAndUpdate(
                req.params.id,
                { title, description, organization, price, passingScore, questions, image },
                { new: true }
            );

            if (!updatedTest) {
                return res.status(404).json({ message: "Test not found" });
            }

            res.status(200).json(updatedTest);
        } catch (error) {
            res.status(400).json({ message: "Error updating test", error });
        }
    }
}

module.exports = new TestController();
