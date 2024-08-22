
const UserRouter = require("./UserRouter");
const authRouter = require("./auth");
const OrganizationRouter = require("./OrganizationRouter");
const CertificateRouter = require("./certificateRouter");
const TestRouter = require("./testRouter");
const TestAttemptRouter = require("./testAttemptRouter");
function router(app){ 
    app.use("/api/v1/users",UserRouter);
    app.use("/api/v1/auth",authRouter);
    app.use("/api/v1/organization",OrganizationRouter);
    app.use("/api/v1/certificates",CertificateRouter);
    app.use("/api/v1/test",TestRouter);
    app.use("/api/v1/testAttempt",TestAttemptRouter);
}
 
module.exports = router