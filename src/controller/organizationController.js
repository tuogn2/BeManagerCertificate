const Organization = require('../models/Organization'); // Đảm bảo đường dẫn đúng đến mô hình Organization
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

class OrganizationController {
    // Tạo tổ chức mới
    async createOrganization(req, res) {
        const { name, address, email, password } = req.body;
        const avatar = req.file; // Lấy tệp từ req.file
        try {
            // Kiểm tra nếu email đã tồn tại
            const existingOrganization = await Organization.findOne({ email });
            if (existingOrganization) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash mật khẩu trước khi lưu
            const hashedPassword = await bcrypt.hash(password, 10);

            let avatarUrl = null;
            if (avatar) {
                // Tải tệp lên Cloudinary
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }).end(avatar.buffer);
                });
                
                avatarUrl = result.secure_url; // Lấy URL của tệp
            }

            const newOrganization = new Organization({
                name,
                address,
                email,
                password: hashedPassword,
                avatar: avatarUrl, // Lưu URL của ảnh
            });

            const savedOrganization = await newOrganization.save();
            return res.status(201).json(savedOrganization);
        } catch (error) {
            console.error('Error creating organization:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Lấy tất cả các tổ chức
    async getAllOrganizations(req, res) {
        try {
            const organizations = await Organization.find()
                .populate('certificatesIssued');
            return res.status(200).json(organizations);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Lấy tổ chức theo ID
    async getOrganizationById(req, res) {
        const orgId = req.params.id;

        try {
            const organization = await Organization.findById(orgId)
                .populate('certificatesIssued');
                
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }
            return res.status(200).json(organization);
        } catch (error) {
            console.error('Error fetching organization:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Cập nhật tổ chức theo ID
    async updateOrganization(req, res) {
        const orgId = req.params.id;
        const { name, address, email, password } = req.body;
        const avatar = req.file; // Lấy tệp từ req.file

        try {
            // Nếu có mật khẩu mới, hash nó trước khi lưu
            let updateData = { name, address, email };
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            let avatarUrl = null;
            if (avatar) {
                // Tải tệp lên Cloudinary
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }).end(avatar.buffer);
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
                return res.status(404).json({ message: 'Organization not found' });
            }

            return res.status(200).json(updatedOrganization);
        } catch (error) {
            console.error('Error updating organization:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Xóa tổ chức theo ID
    async deleteOrganization(req, res) {
        const orgId = req.params.id;

        try {
            const organization = await Organization.findById(orgId);
            if (!organization) {
                return res.status(404).json({ message: 'Organization not found' });
            }

            await Organization.findByIdAndDelete(orgId);
            return res.status(200).json({ message: 'Organization deleted successfully' });
        } catch (error) {
            console.error('Error deleting organization:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new OrganizationController();
