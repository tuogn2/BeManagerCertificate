const UserRouter = require("./UserRouter");
const authRouter = require("./auth");
const OrganizationRouter = require("./OrganizationRouter");
const CertificateRouter = require("./certificateRouter");

const courseRouter = require("./courseRouter");
const courseBundleRouter = require("./courseBundleRoutes");
const enrollmentRouter = require("./enrollmentRoutes");
const QuizRouter = require("./quizResultRouter");
const statsRouter = require("./statsRouter");
const statsOrRouter = require("./statsOrganizationRouter");
function router(app) {
  app.use("/api/v1/users", UserRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/organization", OrganizationRouter);
  app.use("/api/v1/certificates", CertificateRouter);
  app.use("/api/v1/course", courseRouter);
  app.use("/api/v1/coursebundles", courseBundleRouter);
  app.use("/api/v1/enrollment", enrollmentRouter);
  app.use("/api/v1/quiz", QuizRouter);
  app.use("/api/v1/stats", statsRouter);
  app.use("/api/v1/statsOr", statsOrRouter);
}

module.exports = router;
