const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, status } = req.body;

    // Only allow enum values
    const allowedStatuses = ["todo", "inprogress", "done"];
    const finalStatus = allowedStatuses.includes(status) ? status : "todo";

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category: category || "Other",
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        status: finalStatus,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask || existingTask.userId !== req.user.id) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    const allowedStatuses = ["todo", "inprogress", "done"];
    const updates = {
      title: req.body.title ?? existingTask.title,
      description: req.body.description ?? existingTask.description,
      category: req.body.category ?? existingTask.category,
      priority: req.body.priority ?? existingTask.priority,
      status: allowedStatuses.includes(req.body.status)
        ? req.body.status
        : existingTask.status,
      dueDate:
        req.body.dueDate !== undefined
          ? req.body.dueDate
            ? new Date(req.body.dueDate)
            : null
          : existingTask.dueDate,
    };

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: updates,
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE Task (with ownership check)
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask || existingTask.userId !== req.user.id) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};