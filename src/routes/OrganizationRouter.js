const express = require('express');
const router = express.Router();
const organizationController = require('../controller/organizationController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: API endpoints for managing organizations
 */

/**
 * @swagger
 * /organizations:
 *   post:
 *     tags: [Organizations]
 *     summary: Create a new organization with an avatar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organization name
 *               address:
 *                 type: string
 *                 description: Organization address
 *               email:
 *                 type: string
 *                 description: Organization email
 *               password:
 *                 type: string
 *                 description: Organization password
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', upload.single('avatar'), organizationController.createOrganization);

/**
 * @swagger
 * /organizations:
 *   get:
 *     tags: [Organizations]
 *     summary: Get all organizations
 *     responses:
 *       200:
 *         description: List of all organizations
 *       500:
 *         description: Server error
 */
router.get('/', organizationController.getAllOrganizations);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get an organization by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization found
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.get('/:id', organizationController.getOrganizationById);

/**
 * @swagger
 * /organizations/{id}/activate:
 *   patch:
 *     tags: [Organizations]
 *     summary: Activate an organization by setting isActive to true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization activated successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.put('/:id/activate', organizationController.changeIsActiveTrue);

router.put("/:id/change-password", organizationController.changePassword);
/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     tags: [Organizations]
 *     summary: Update an organization by ID with an avatar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organization name
 *               address:
 *                 type: string
 *                 description: Organization address
 *               email:
 *                 type: string
 *                 description: Organization email
 *               password:
 *                 type: string
 *                 description: Organization password
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.put('/:id', upload.single('avatar'), organizationController.updateOrganization);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     tags: [Organizations]
 *     summary: Delete an organization by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Organization ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', organizationController.deleteOrganization);



module.exports = router;
