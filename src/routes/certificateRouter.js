const express = require("express");
const router = express.Router();
const certificateController = require("@controllers/certificateController"); // Sử dụng alias @controllers
const middlewareController = require("@middleware/middlewareController"); // Sử dụng alias @middleware

router.post("/createCertificateBunble",middlewareController.verifyTokenStudent, certificateController.createCertificateOfBunble);


/**
 * @openapi
 * /api/certificates:
 *   post:
 *     summary: Create a new certificate
 *     tags:
 *       - Certificates
 *     requestBody:
 *       description: Information needed to create a certificate
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user
 *                 example: "60d21babd9d3c9f7b230f2b4"
 *               organization:
 *                 type: string
 *                 description: The ID of the organization
 *                 example: "60d21babd9d3c9f7b230f2b5"
 *               course:
 *                 type: string
 *                 description: The ID of the course
 *                 example: "60d21babd9d3c9f7b230f2b6"
 *               score:
 *                 type: number
 *                 description: The score achieved by the user
 *                 example: 95
 *     responses:
 *       201:
 *         description: Certificate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificate:
 *                   type: object
 *                   description: The created certificate
 *                 imageUrl:
 *                   type: string
 *                   description: URL of the certificate image
 *       404:
 *         description: User, Organization, or Course not found
 *       400:
 *         description: Error creating certificate
 */
router.post("/", middlewareController.verifyTokenStudent,certificateController.create);

/**
 * @openapi
 * /api/certificates/{id}:
 *   get:
 *     summary: Retrieve a certificate by ID
 *     tags:
 *       - Certificates
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the certificate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Certificate not found
 */
router.get("/:id", certificateController.getById);

/**
 * @openapi
 * /api/certificates:
 *   get:
 *     summary: Retrieve all certificates
 *     tags:
 *       - Certificates
 *     responses:
 *       200:
 *         description: List of certificates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", certificateController.getAll);

/**
 * @openapi
 * /api/certificates/{id}:
 *   put:
 *     summary: Update a certificate by ID
 *     tags:
 *       - Certificates
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the certificate to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New certificate information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificateId:
 *                 type: string
 *                 description: New certificate ID
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *       404:
 *         description: Certificate not found
 *       400:
 *         description: Error updating certificate
 */
router.put("/:id",middlewareController.verifyTokenAdmin, certificateController.update);

/**
 * @openapi
 * /api/certificates/{id}:
 *   delete:
 *     summary: Delete a certificate by ID
 *     tags:
 *       - Certificates
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the certificate to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Error deleting certificate
 */
router.delete("/:id",middlewareController.verifyTokenAdmin, certificateController.delete);

/**
 * @openapi
 * /api/certificates/student/{studentId}:
 *   get:
 *     summary: Retrieve certificates by student ID
 *     tags:
 *       - Certificates
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: ID of the student (user)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of certificates for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No certificates found for the student
 *       500:
 *         description: Error retrieving certificates
 */
router.get("/student/:studentId", certificateController.getByStudentId);



module.exports = router;
