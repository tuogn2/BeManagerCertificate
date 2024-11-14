const express = require('express');
const router = express.Router();
const courseController = require('@controllers/courseController'); // Sử dụng alias @controllers
const upload = require('@middleware/upload'); // Sử dụng alias @middleware
const middlewareController = require('@middleware/middlewareController'); // Sử dụng alias @middleware

/**
 * @openapi
 * /api/courses/search:
 *   get:
 *     summary: Search courses by title
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search term for course titles
 *         required: true
 *         schema:
 *           type: string
 *           example: "JavaScript"
 *     responses:
 *       200:
 *         description: List of courses matching the search term
 *       400:
 *         description: Invalid query parameter
 *       500:
 *         description: Server error
 */
router.get('/search', courseController.search);

router.get('/countCourse', courseController.countCourses);


/**
 * @openapi
 * /api/courses/inactive:
 *   get:
 *     summary: Get inactive courses
 *     tags:
 *       - Courses
 *     description: Retrieve all courses where isActive is false
 *     responses:
 *       200:
 *         description: List of inactive courses
 *       404:
 *         description: No inactive courses found
 *       500:
 *         description: Server error
 */
router.get('/inactive', courseController.getInactiveCourses);

router.get('/organization/:id',courseController.getCourseByOrganization);

/**
 * @openapi
 * /api/courses/{id}/activate:
 *   put:
 *     summary: Change course isActive status to true
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the course to activate
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21babd9d3c9f7b230f2b6"
 *     responses:
 *       200:
 *         description: Course activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course activated successfully"
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/:id/activate',middlewareController.verifyTokenOrganizationOrAdmin, courseController.changeActiveToTrue);
/**
 * @openapi
 * /api/courses/{id}:
 *   put:
 *     summary: Update course by ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the course to update
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21babd9d3c9f7b230f2b6"
 *     requestBody:
 *       description: Updated course information
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course
 *                 example: "Advanced JavaScript"
 *               description:
 *                 type: string
 *                 description: Description of the course
 *                 example: "In-depth JavaScript programming."
 *               organization:
 *                 type: string
 *                 description: ID of the organization offering the course
 *                 example: "60d21babd9d3c9f7b230f2b6"
 *               price:
 *                 type: number
 *                 description: Price of the course
 *                 example: 149.99
 *               finalQuiz:
 *                 type: object
 *                 description: Final quiz object
 *                 properties:
 *                   questions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         questionText:
 *                           type: string
 *                           description: Text of the question
 *                           example: "What is closure in JavaScript?"
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               text:
 *                                 type: string
 *                                 description: Option text
 *                                 example: "A function within another function"
 *                         correctAnswer:
 *                           type: string
 *                           description: Correct answer text
 *                           example: "A function within another function"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated course image
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/:id',middlewareController.verifyTokenOrganizationOrAdmin, upload.single('image'), courseController.update);

/**
 * @openapi
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course by ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the course to delete
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21babd9d3c9f7b230f2b6"
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',middlewareController.verifyTokenOrganizationOrAdmin, courseController.delete);
/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Courses
 *     requestBody:
 *       description: Course information
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course
 *                 example: "Introduction to JavaScript"
 *               description:
 *                 type: string
 *                 description: Description of the course
 *                 example: "Learn the basics of JavaScript programming."
 *               organization:
 *                 type: string
 *                 description: ID of the organization offering the course
 *                 example: "60d21babd9d3c9f7b230f2b6"
 *               price:
 *                 type: number
 *                 description: Price of the course
 *                 example: 99.99
 *               finalQuiz:
 *                 type: object
 *                 description: Final quiz object
 *                 properties:
 *                   questions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         questionText:
 *                           type: string
 *                           description: Text of the question
 *                           example: "What is JavaScript?"
 *                         options:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               text:
 *                                 type: string
 *                                 description: Option text
 *                                 example: "A programming language"
 *                         correctAnswer:
 *                           type: string
 *                           description: Correct answer text
 *                           example: "A programming language"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Course image
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', middlewareController.verifyTokenOr,upload.single('image'), courseController.create);

/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags:
 *       - Courses
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the course to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d21babd9d3c9f7b230f2b6"
 *     responses:
 *       200:
 *         description: Details of the course
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', courseController.getById);

/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: List of all courses
 *       500:
 *         description: Server error
 */
router.get('/', courseController.getAll);






module.exports = router;
