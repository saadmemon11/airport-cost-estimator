const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Get all projects for user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create project
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, project, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add department
router.post('/:id/departments', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.departments.push(req.body);
    await project.save();
    res.status(201).json({ success: true, project, message: 'Department added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update department
router.put('/:id/departments/:deptId', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const dept = project.departments.id(req.params.deptId);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    Object.assign(dept, req.body);
    await project.save();
    res.json({ success: true, project, message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete department
router.delete('/:id/departments/:deptId', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    project.departments.pull(req.params.deptId);
    await project.save();
    res.json({ success: true, project, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add sub-item to department
router.post('/:id/departments/:deptId/items', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const dept = project.departments.id(req.params.deptId);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    const item = req.body;
    item.totalCost = (item.quantity || 0) * (item.unitCost || 0);
    dept.subItems.push(item);
    await project.save();
    res.status(201).json({ success: true, project, message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update sub-item
router.put('/:id/departments/:deptId/items/:itemId', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const dept = project.departments.id(req.params.deptId);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    const item = dept.subItems.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const updatedData = req.body;
    updatedData.totalCost = (updatedData.quantity || item.quantity) * (updatedData.unitCost || item.unitCost);
    Object.assign(item, updatedData);
    await project.save();
    res.json({ success: true, project, message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete sub-item
router.delete('/:id/departments/:deptId/items/:itemId', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const dept = project.departments.id(req.params.deptId);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    dept.subItems.pull(req.params.itemId);
    await project.save();
    res.json({ success: true, project, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get project cost summary
router.get('/:id/summary', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    let totalBaseCost = 0;
    const deptSummaries = project.departments.map(dept => {
      const baseCost = dept.subItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
      const contingencyAmount = baseCost * (dept.contingencyPercent / 100);
      const totalWithContingency = baseCost + contingencyAmount;
      totalBaseCost += baseCost;
      return {
        id: dept._id,
        name: dept.name,
        category: dept.category,
        itemCount: dept.subItems.length,
        baseCost,
        contingencyPercent: dept.contingencyPercent,
        contingencyAmount,
        totalWithContingency,
        status: dept.status
      };
    });

    const globalContingencyAmount = totalBaseCost * (project.globalContingency / 100);
    const grandTotal = totalBaseCost + globalContingencyAmount;

    res.json({
      success: true,
      summary: {
        projectName: project.name,
        projectCode: project.projectCode,
        currency: project.currency,
        totalDepartments: project.departments.length,
        totalBaseCost,
        globalContingencyPercent: project.globalContingency,
        globalContingencyAmount,
        grandTotal,
        departments: deptSummaries,
        status: project.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
