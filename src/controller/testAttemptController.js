const TestAttempt = require("../models/TestAttempt");

class TestAttemptController {
    // Tạo một bài test attempt mới
    async create(req, res) {
        const { user, test, score, passed, answers } = req.body;

        try {
            const testAttempt = new TestAttempt({
                user,
                test,
                score,
                passed,
                answers,
            });

            const savedTestAttempt = await testAttempt.save();
            res.status(201).json(savedTestAttempt);
        } catch (error) {
            res.status(400).json({ message: "Error creating test attempt", error });
        }
    }

    // Đọc thông tin về một test attempt theo ID
    async getById(req, res) {
        try {
            const testAttempt = await TestAttempt.findById(req.params.id)
                .populate("user")
                .populate("test");
            if (!testAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }
            res.status(200).json(testAttempt);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test attempt", error });
        }
    }

    // Đọc tất cả các test attempt
    async getAll(req, res) {
        try {
            const testAttempts = await TestAttempt.find()
                .populate("user")
                .populate("test");
            res.status(200).json(testAttempts);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test attempts", error });
        }
    }

    // Chỉnh sửa một test attempt theo ID
    async update(req, res) {
        const { score, passed, answers } = req.body;

        try {
            const updatedTestAttempt = await TestAttempt.findByIdAndUpdate(
                req.params.id,
                { score, passed, answers },
                { new: true }
            );

            if (!updatedTestAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }

            res.status(200).json(updatedTestAttempt);
        } catch (error) {
            res.status(400).json({ message: "Error updating test attempt", error });
        }
    }

    // Xóa một test attempt theo ID
    async delete(req, res) {
        try {
            const deletedTestAttempt = await TestAttempt.findByIdAndDelete(req.params.id);

            if (!deletedTestAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }

            res.status(200).json({ message: "Test attempt deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting test attempt", error });
        }
    }
}

module.exports = new TestAttemptController();
