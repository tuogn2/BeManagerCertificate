const Organization = require("../models/Organization"); // Đảm bảo đường dẫn đúng đến mô hình Organization
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

class OrganizationController {
  // Tạo tổ chức mới
  async createOrganization(req, res) {
    const { name, address, email, password, walletaddress } = req.body;
    const avatar = req.file; // Lấy tệp từ req.file
    try {
      // Kiểm tra nếu email đã tồn tại
      const existingOrganization = await Organization.findOne({ email });
      if (existingOrganization) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(password, 10);

      let avatarUrl = null;
      if (avatar) {
        // Tải tệp lên Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(avatar.buffer);
        });

        avatarUrl = result.secure_url; // Lấy URL của tệp
      }

      const newOrganization = new Organization({
        name,
        address,
        email,
        password: hashedPassword,
        avatar: avatarUrl, // Lưu URL của ảnh
        walletaddress,
      });

      const savedOrganization = await newOrganization.save();
      return res.status(201).json(savedOrganization);
    } catch (error) {
      console.error("Error creating organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Lấy tất cả các tổ chức
  async getAllOrganizations(req, res) {
    try {
      const organizations = await Organization.find({
        isActive: true,
      }).populate("certificatesIssued");
      return res.status(200).json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Lấy tổ chức theo ID
  async getOrganizationById(req, res) {
    const orgId = req.params.id;

    try {
      const organization = await Organization.findById(orgId).populate(
        "certificatesIssued"
      );

      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      return res.status(200).json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Cập nhật tổ chức theo ID
  async updateOrganization(req, res) {
    const orgId = req.params.id;
    const { name, address, email, walletaddress } = req.body; // Không lấy password từ body nếu không cập nhật
    const avatar = req.file; // Lấy tệp từ req.file
  
    try {
      // Dữ liệu để cập nhật tổ chức (không bao gồm password)
      let updateData = { name, address, email, walletaddress }; // Thêm walletAddress vào dữ liệu cập nhật
  
      let avatarUrl = null;
      if (avatar) {
        // Tải tệp lên Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(avatar.buffer);
        });
  
        avatarUrl = result.secure_url; // Lấy URL của tệp
        updateData.avatar = avatarUrl; // Cập nhật URL của ảnh
      }
  
      const updatedOrganization = await Organization.findByIdAndUpdate(
        orgId,
        updateData,
        { new: true } // Trả về tài liệu đã cập nhật
      );
  
      if (!updatedOrganization) {
        return res.status(404).json({ message: "Organization not found" });
      }
  
      return res.status(200).json(updatedOrganization);
    } catch (error) {
      console.error("Error updating organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  async changePassword(req, res) {
    const orgId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
      // Lấy tổ chức theo ID
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // So sánh mật khẩu cũ với mật khẩu hiện tại
      const isMatch = await bcrypt.compare(oldPassword, organization.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      // Hash mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới
      organization.password = hashedNewPassword;
      await organization.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Xóa tổ chức theo ID
  async deleteOrganization(req, res) {
    const orgId = req.params.id;

    try {
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      await Organization.findByIdAndDelete(orgId);
      return res
        .status(200)
        .json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Error deleting organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  async changeIsActiveTrue(req, res) {
    const orgId = req.params.id;
    try {
      // Update the organization by ID, setting isActive to true and returning the updated document
      const organization = await Organization.findByIdAndUpdate(
        orgId,
        { isActive: false },
        { new: true }
      );

      // If no organization is found, return a 404 response
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // If successful, return the updated organization
      return res.status(200).json(organization);
    } catch (error) {
      // Log and return a 500 error if something goes wrong
      console.error("Error updating organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new OrganizationController();
