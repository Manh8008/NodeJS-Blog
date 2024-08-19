const Course = require("../models/Course");
const { mongooseToObject } = require("../../util/mongoose");
class CourseController {
    // [GET] /course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                console.log(course);
                res.render("courses/show", {
                    course: mongooseToObject(course),
                });
            })
            .catch(next);
    }

    // [GET] /course/create
    create(req, res, next) {
        res.render("courses/create");
    }
    // [POST] /course/store
    store(req, res, next) {
        req.body.image = `https:// img.youtube.com/vi/${req.body.videoId}/hqdefault.jpg`;
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect("/me/stored/courses"))
            .catch(next);
    }

    // [GET] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) =>
                res.render("courses/edit", {
                    course: mongooseToObject(course),
                })
            )
            .catch(next);
    }

    // [PUT] /course/:id
    update(req, res, next) {
        Course.findOneAndUpdate({ _id: req.params.id }, req.body, {
            upsert: true,
            new: true,
        })
            .then(() => {
                res.redirect("/me/stored/courses");
            })
            .catch(next);
    }

    // [DELETE] /course/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [DELETE] /course/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PATCH] /course/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => {
                return Course.findByIdAndUpdate(req.params.id, {
                    deleted: false,
                });
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [POST] /course/handle-form-actions
    handleFormActions(req, res, next) {
        const courseIds = req.body.courseIds;
        console.log(courseIds);

        if (!Array.isArray(courseIds)) {
            // Nếu courseIds không phải là một mảng, ta sẽ chuyển nó thành một mảng chứa một phần tử
            courseIds = [courseIds];
        }

        switch (req.body.action) {
            case "delete":
                Course.delete({ _id: { $in: courseIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;

            case "restore":
                if (courseIds.length === 1) {
                    // Nếu chỉ có một id được truyền vào, thực hiện khôi phục cho một khóa học
                    Course.restore({ _id: courseIds[0] })
                        .then(() => {
                            return Course.findByIdAndUpdate(courseIds[0], {
                                deleted: false,
                            });
                        })
                        .then(() => res.redirect("back"))
                        .catch(next);
                } else {
                    // Nếu có nhiều id được truyền vào, thực hiện khôi phục cho nhiều khóa học
                    Course.restore({ _id: { $in: courseIds } })
                        .then(() => {
                            return Course.updateMany(
                                { _id: { $in: courseIds } },
                                { deleted: false }
                            );
                        })
                        .then(() => res.redirect("back"))
                        .catch(next);
                }
                break;

            case "permanently_deleted":
                if (courseIds.length === 1) {
                    Course.deleteOne({ _id: courseIds[0] })
                        .then(() => res.redirect("back"))
                        .catch(next);
                } else {
                    Course.deleteMany({ _id: { $in: courseIds } })
                        .then(() => res.redirect("back"))
                        .catch(next);
                }
                break;

            default:
                res.json({ message: "Action is invalid" });
        }
        console.log(req.body.action);
    }
}

module.exports = new CourseController();
