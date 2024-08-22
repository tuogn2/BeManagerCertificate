const Certificate = require("../models/Certificate");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const createCertificateImage = require("../utils/createCertificateImage");
// const User = require('./models/User'); // Đảm bảo đường dẫn chính xác
const Organization = require('../models/Organization'); // Đảm bảo đường dẫn đúng đến mô hình Organization
const Test = require("../models/Test");
class CertificateController {
  // Tạo một certificate mới
  //   async create(req, res) {
  //     const { user, organization, test, score } = req.body;

  //     try {
  //       // Tạo chứng chỉ với certificateId tự động
  //       const certificate = new Certificate({
  //         user,
  //         organization,
  //         test,
  //         certificateId: uuidv4(), // Tạo ID duy nhất cho certificateId
  //         score,  // Thêm điểm số vào chứng chỉ
  //       });

  //       const savedCertificate = await certificate.save();

  //       // Cập nhật user với chứng chỉ mới
  //       await User.findByIdAndUpdate(user, {
  //         $push: { certificates: savedCertificate._id }
  //       });

  //       res.status(201).json(savedCertificate);
  //     } catch (error) {
  //       res.status(400).json({ message: 'Error creating certificate', error });
  //     }
  //   }
  async  create(req, res) {
    const { user: userId, organization: organizationId, test: testId, score } = req.body;
  
    try {
      // Lấy thông tin người dùng, tổ chức và bài kiểm tra từ cơ sở dữ liệu
      const user = await User.findById(userId);
      const organization = await Organization.findById(organizationId);
      const test = await Test.findById(testId);
  
      if (!user || !organization || !test) {
        return res.status(404).json({ message: "User, Organization, or Test not found" });
      }
  
      // Tạo chứng chỉ trong cơ sở dữ liệu
      const certificate = new Certificate({
        user: userId,
        organization: organizationId,
        test: testId,
        certificateId: uuidv4(), // Tạo UUID cho chứng chỉ
        score,
      });
  
      const savedCertificate = await certificate.save();
  
      // Tạo ảnh chứng chỉ và tải lên Cloudinary
      const certificateImageUrl = await createCertificateImage({
        userName: user.name, // Sử dụng tên người dùng thực tế
        organizationName: organization.name, // Sử dụng tên tổ chức thực tế
        testName: test.title, // Sử dụng tên bài kiểm tra thực tế
        score: score,
      });
  
      // Cập nhật URL chứng chỉ vào cơ sở dữ liệu
      savedCertificate.imageUrl = certificateImageUrl;
      await savedCertificate.save();
  
      // Trả về thông tin chứng chỉ và URL ảnh
      res.status(201).json({
        certificate: savedCertificate,
        imageUrl: certificateImageUrl,
      });
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
      const deletedCertificate = await Certificate.findByIdAndDelete(
        req.params.id
      );

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
