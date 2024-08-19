const newsRouter = require("./news");
const meRouter = require("./me");
const CoursesRouter = require("./courses");
const siteRouter = require("./site");

function route(app) {
    // Định nghĩa route cho trang chủ
    app.use("/news", newsRouter);
    app.use("/me", meRouter);
    app.use("/courses", CoursesRouter);
    app.use("/", siteRouter);
}

module.exports = route;
