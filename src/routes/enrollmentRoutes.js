const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/EnrollmentController');

/**
 * @openapi
 * /api/enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags:
 *       - Enrollments
 *     requestBody:
 *       description: Enrollment information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the user enrolling
 *                 example: "60d21babd9d3c9f7b230f2b6"
 *               course:
 *                 type: string
 *                 description: ID of the course being enrolled in
 *                 example: "60d21c0fd9d3c9f7b230f2b7"
 *               bundle:
 *                 type: string
 *                 description: ID of the bundle (if any)
 *                 example: "60d21c1fd9d3c9f7b230f2b8"
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course or user not found
 *       500:
 *         description: Server error
 */
router.post('/', enrollmentController.create);

/**
 * @openapi
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags:
 *       - Enrollments
 *     responses:
 *       200:
 *         description: List of all enrollments
 *       500:
 *         description: Server error
 */
router.get('/', enrollmentController.getAll);

/**
 * @openapi
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the enrollment to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21c2fd9d3c9f7b230f2b9"
 *     responses:
 *       200:
 *         description: Enrollment details
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', enrollmentController.getById);

/**
 * @openapi
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment by ID
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the enrollment to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21c3fd9d3c9f7b230f2ba"
 *     requestBody:
 *       description: Updated enrollment information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 description: Enrollment progress
 *                 example: 75
 *               completed:
 *                 type: boolean
 *                 description: Whether the enrollment is completed
 *                 example: false
 *               idOfItems:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of item IDs associated with the enrollment
 *                 example: ["60d21c4fd9d3c9f7b230f2bb"]
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.put('/:id', enrollmentController.update);

/**
 * @openapi
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete enrollment by ID
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the enrollment to delete
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21c5fd9d3c9f7b230f2bc"
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', enrollmentController.delete);

/**
 * @openapi
 * /api/enrollments/user/{userId}:
 *   get:
 *     summary: Get all enrollments for a specific user
 *     tags:
 *       - Enrollments
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to retrieve enrollments for
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21babd9d3c9f7b230f2b6"
 *     responses:
 *       200:
 *         description: List of enrollments for the user
 *       404:
 *         description: No enrollments found for the user
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', enrollmentController.getEnrollmentsByUser);

module.exports = router;
