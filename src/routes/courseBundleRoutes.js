const express = require('express');
const router = express.Router();
const courseBundleController = require('../controller/CourseBundleController');
const upload = require('../middleware/upload'); // Import middleware upload




// New search route
router.get("/search", courseBundleController.search);

/**
 * @openapi
 * /api/course-bundles/organization/{organizationId}:
 *   get:
 *     summary: Get course bundles by organization ID
 *     tags:
 *       - CourseBundles
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         description: ID of the organization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of course bundles for the specified organization
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Error retrieving course bundles
 */
router.get('/:organizationId', courseBundleController.getByOrganization);

/**
 * @openapi
 * /api/course-bundles:
 *   post:
 *     summary: Create a new course bundle
 *     tags:
 *       - CourseBundles
 *     requestBody:
 *       description: Course bundle information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course bundle
 *                 example: "Full Stack Web Development Bundle"
 *               description:
 *                 type: string
 *                 description: Description of the course bundle
 *                 example: "A comprehensive bundle of full stack web development courses."
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of course IDs included in the bundle
 *                 example: ["60d21babd9d3c9f7b230f2b4", "60d21babd9d3c9f7b230f2b5"]
 *               organization:
 *                 type: string
 *                 description: ID of the organization offering the bundle
 *                 example: "60d21babd9d3c9f7b230f2b6"
 *     responses:
 *       201:
 *         description: Course bundle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error creating course bundle
 */
router.post('/',upload.single('image'), courseBundleController.create);

/**
 * @openapi
 * /api/course-bundles:
 *   get:
 *     summary: Get all course bundles
 *     tags:
 *       - CourseBundles
 *     responses:
 *       200:
 *         description: List of all course bundles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the course bundle
 *                   title:
 *                     type: string
 *                     description: Title of the course bundle
 *                   description:
 *                     type: string
 *                     description: Description of the course bundle
 *                   courses:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of course IDs in the bundle
 *                   organization:
 *                     type: string
 *                     description: ID of the organization offering the bundle
 *       500:
 *         description: Error retrieving course bundles
 */
router.get('/', courseBundleController.getAll);

/**
 * @openapi
 * /api/course-bundles/{id}:
 *   get:
 *     summary: Get a course bundle by ID
 *     tags:
 *       - CourseBundles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the course bundle
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course bundle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the course bundle
 *                 title:
 *                   type: string
 *                   description: Title of the course bundle
 *                 description:
 *                   type: string
 *                   description: Description of the course bundle
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of course IDs in the bundle
 *                 organization:
 *                   type: string
 *                   description: ID of the organization offering the bundle
 *       404:
 *         description: Course bundle not found
 *       500:
 *         description: Error retrieving course bundle
 */
router.get('/getid/:id', courseBundleController.getById);

/**
 * @openapi
 * /api/course-bundles/{id}:
 *   put:
 *     summary: Update a course bundle by ID
 *     tags:
 *       - CourseBundles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the course bundle
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated course bundle information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course bundle
 *                 example: "Advanced Full Stack Web Development Bundle"
 *               description:
 *                 type: string
 *                 description: Description of the course bundle
 *                 example: "An updated bundle including advanced topics in full stack development."
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of course IDs included in the bundle
 *               organization:
 *                 type: string
 *                 description: ID of the organization offering the bundle
 *     responses:
 *       200:
 *         description: Course bundle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Course bundle not found
 *       400:
 *         description: Error updating course bundle
 */
router.put('/:id',upload.single('image'), courseBundleController.update);

/**
 * @openapi
 * /api/course-bundles/{id}:
 *   delete:
 *     summary: Delete a course bundle by ID
 *     tags:
 *       - CourseBundles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the course bundle
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course bundle deleted successfully
 *       404:
 *         description: Course bundle not found
 *       500:
 *         description: Error deleting course bundle
 */
router.delete('/:id', courseBundleController.delete);

module.exports = router;
