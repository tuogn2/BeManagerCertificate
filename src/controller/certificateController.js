const Certificate = require("../models/Certificate");

class CertificateController {
    // Tạo một certificate mới
    async create(req, res) {
        const { user, organization, test, certificateId } = req.body;

        try {
            const certificate = new Certificate({
                user,
                organization,
                test,
                certificateId,
            });

            const savedCertificate = await certificate.save();
            res.status(201).json(savedCertificate);
        } catch (error) {
            res.status(400).json({ message: "Error creating certificate", error });
        }
    }

    // Đọc thông tin về một certificate theo ID
    async getById(req, res) {
        try {
            const certificate = await Certificate.findById(req.params.id)
                .populate("user")
                .populate("organization")
                .populate("test");
            if (!certificate) {
                return res.status(404).json({ message: "Certificate not found" });
            }
            res.status(200).json(certificate);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving certificate", error });
        }
    }

    // Đọc tất cả các certificate
    async getAll(req, res) {
        try {
            const certificates = await Certificate.find()
                .populate("user")
                .populate("organization")
                .populate("test");
            res.status(200).json(certificates);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving certificates", error });
        }
    }

    // Cập nhật một certificate theo ID
    async update(req, res) {
        const { certificateId } = req.body;

        try {
            const updatedCertificate = await Certificate.findByIdAndUpdate(
                req.params.id,
                { certificateId },
                { new: true }
            );

            if (!updatedCertificate) {
                return res.status(404).json({ message: "Certificate not found" });
            }

            res.status(200).json(updatedCertificate);
        } catch (error) {
            res.status(400).json({ message: "Error updating certificate", error });
        }
    }

    // Xóa một certificate theo ID
    async delete(req, res) {
        try {
            const deletedCertificate = await Certificate.findByIdAndDelete(req.params.id);

            if (!deletedCertificate) {
                return res.status(404).json({ message: "Certificate not found" });
            }

            res.status(200).json({ message: "Certificate deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting certificate", error });
        }
    }
}

module.exports = new CertificateController();
