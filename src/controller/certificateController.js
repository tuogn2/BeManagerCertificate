const Certificate = require("../models/Certificate");
const User = require("../models/User");
const QuizResult = require("../models/quizResult");
const Course = require("../models/Course");

const Organization = require("../models/Organization");
const { v4: uuidv4 } = require("uuid");

const createCertificateImage = require("../utils/createCertificateImage");

const { web3, contract } = require("../../contract");

class CertificateController {
  async create(req, res) {
    const {
      user: userId,
      organization: organizationId,
      course: courseId,
      score,
    } = req.body;

    try {
      // Fetch the user, organization, and course from the database
      const user = await User.findById(userId);
      const organization = await Organization.findById(organizationId);
      const course = await Course.findById(courseId);

      if (!user || !organization || !course) {
        return res
          .status(404)
          .json({ message: "User, Organization, or Course not found" });
      }

      // Create a new certificate
      const certificate = new Certificate({
        user: userId,
        organization: organizationId,
        course: courseId,
        certificateId: uuidv4(), // Generate a UUID for the certificate
        score,
      });

      const savedCertificate = await certificate.save();

      // Generate certificate image and upload to Cloudinary
      const certificateImageUrl = await createCertificateImage({
        userName: user.name,
        organizationName: organization.name,
        organizationAvt: organization.avatar,
        courseName: course.title,
        score: score,
      });

      // Update the certificate with the image URL
      savedCertificate.imageUrl = certificateImageUrl;
      await savedCertificate.save();

      user.certificates.push(savedCertificate._id);
      await user.save();

      // Gọi hợp đồng thông minh để cập nhật chứng chỉ trên blockchain

      await contract.methods
        .addCertificateDetails(
          courseId, // ID khóa học (courseId từ MongoDB)
          userId, // ID sinh viên (userId từ MongoDB)
          "thisishash", // Hash của chứng chỉ (nếu có, có thể là một hash duy nhất được tạo dựa trên thông tin chứng chỉ)
          score, // Điểm số của sinh viên
          savedCertificate.certificateId, // ID chứng chỉ (UUID được tạo trong MongoDB)
          certificateImageUrl, // URL của ảnh chứng chỉ (được tải lên Cloudinary)
          true // Trạng thái hoàn thành khóa học
        )
        .send({ from: web3.eth.defaultAccount }); // Địa chỉ ví Ethereum thực hiện giao dịch

      // Return the saved certificate and image URL
      res.status(201).json({
        certificate: savedCertificate,
        imageUrl: certificateImageUrl,
      });
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(400).json({ message: "Error creating certificate", error });
    }
  }

  // Đọc thông tin về một certificate theo ID
  async getById(req, res) {
    try {
      const certificate = await Certificate.findById(req.params.id)
        .populate("user")
        .populate("organization")
        .populate("course");

      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.status(200).json(certificate);
    } catch (error) {
      console.error("Error retrieving certificate:", error);
      res.status(500).json({ message: "Error retrieving certificate", error });
    }
  }

  // Đọc tất cả các certificate
  async getAll(req, res) {
    try {
      const certificates = await Certificate.find()
        .populate("user")
        .populate("organization")
        .populate("course");

      res.status(200).json(certificates);
    } catch (error) {
      console.error("Error retrieving certificates:", error);
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
      console.error("Error updating certificate:", error);
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
      console.error("Error deleting certificate:", error);
      res.status(500).json({ message: "Error deleting certificate", error });
    }
  }

  // Get certificates by student (user) ID
  async getByStudentId(req, res) {
    try {
      const { studentId } = req.params;
  
      // Fetch certificates based on student (user) ID, excluding certain fields from course and organization
      const certificates = await Certificate.find({ user: studentId })
        .populate({
          path: 'organization',
          select: '-password', // Exclude password from organization
        })
        .populate({
          path: 'course',
          select: '-finalQuiz -documents', // Exclude finalQuiz and documents from course
        });
  
      if (certificates.length === 0) {
        return res
          .status(404)
          .json({ message: "No certificates found for this student" });
      }
  
      res.status(200).json(certificates);
    } catch (error) {
      console.error("Error retrieving certificates by student ID:", error);
      res.status(500).json({ message: "Error retrieving certificates", error });
    }
  }
  
}

module.exports = new CertificateController();
