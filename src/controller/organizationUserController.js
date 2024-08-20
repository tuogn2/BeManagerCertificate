const OrganizationUser = require('../models/OrganizationUser'); // Đảm bảo đúng đường dẫn đến mô hình OrganizationUser

class OrganizationUserController {
  // Tạo người dùng mới
  async createOrganizationUser(req, res) {
    const { name, email, password, role, organization } = req.body;
    try {
      const newUser = new OrganizationUser({
        name,
        email,
        password,
        role,
        organization
      });

      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    } catch (error) {
      console.error('Error creating organization user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Lấy tất cả người dùng
  async getAllOrganizationUsers(req, res) {
    try {
      const users = await OrganizationUser.find().populate('organization');
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching organization users:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Lấy người dùng theo ID
  async getOrganizationUserById(req, res) {
    const userId = req.params.id;

    try {
      const user = await OrganizationUser.findById(userId).populate('organization');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching organization user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Cập nhật người dùng
  async updateOrganizationUser(req, res) {
    const userId = req.params.id;
    const { name, email, password, role, organization } = req.body;

    try {
      const updatedUser = await OrganizationUser.findByIdAndUpdate(
        userId,
        { name, email, password, role, organization, lastModified: Date.now() },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating organization user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Xóa người dùng
  async deleteOrganizationUser(req, res) {
    const userId = req.params.id;

    try {
      const deletedUser = await OrganizationUser.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting organization user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new OrganizationUserController();
