import { Router } from "express";
import { authController } from "./controller/authController";
import { studentController } from "./controller/studentController";
import { courseController } from "./controller/courseController";
import { examController } from "./controller/examController";
import { questionController } from "./controller/questionController";
import { myController } from "./controller/myController";
import { authenticate, requireRole } from "./security/middleware";

export const router = Router();

router.post("/auth/login", authController.login);

router.use(authenticate);

router.get("/students", requireRole('admin'), studentController.list);
router.post("/students", requireRole('admin'), studentController.create);
router.put("/students/:id", requireRole('admin'), studentController.update);
router.delete("/students/:id", requireRole('admin'), studentController.deactivate);

router.get("/courses", requireRole('admin'), courseController.list);
router.post("/courses", requireRole('admin'), courseController.create);
router.put("/courses/:id", requireRole('admin'), courseController.update);
router.delete("/courses/:id", requireRole('admin'), courseController.remove);

router.get("/exams", requireRole('admin'), examController.list);
router.get("/exams/:id", requireRole('admin'), examController.getOne);
router.post("/exams", requireRole('admin'), examController.create);
router.put("/exams/:id", requireRole('admin'), examController.update);
router.delete("/exams/:id", requireRole('admin'), examController.remove);

router.get("/exams/:id/questions", requireRole('admin'), questionController.listForExam);
router.post("/exams/:id/questions", requireRole('admin'), questionController.create);

router.put("/questions/:id", requireRole('admin'), questionController.update);
router.delete("/questions/:id", requireRole('admin'), questionController.remove);

router.get("/exams/:id/results", requireRole('admin'), examController.results);

router.get("/my/exams", requireRole('student'), myController.listExams);
router.get("/my/exams/:id", requireRole('student'), myController.getExam);
router.post("/my/exams/:id/submit", requireRole('student'), myController.submit);
router.get("/my/results", requireRole('student'), myController.myResults);
