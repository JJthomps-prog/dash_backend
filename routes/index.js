const express = require('express');
const router = express.Router();
const fs = require('fs').promises; 
const path = require('path');

const filePath = path.join(__dirname, './data.json');

const readData = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data from file:', error);
        return [];
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data to file:', error);
    }
};

router.get('/getAllData', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        console.error('Error getting all data:', error);
        res.status(500).json({ error: 'Failed to get data' });
    }
});

router.get('/getDataByName/:name', async (req, res) => {
    try {
        const data = await readData();
        const projectName = req.params.name;
        const project = data.find(p => p.name.toLowerCase() === projectName.toLowerCase());

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error getting data by name:', error);
        res.status(500).json({ error: 'Failed to get data by name' });
    }
});

router.delete('/getDataByName/:name',async (req,res) => {
    const data =await readData();
    const projectName = req.params.name;
    const projectIndex = data.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    if (projectIndex!==-1){
        const deletedProject = data.splice(projectIndex, 1);
        writeData(data);
        res.json(deletedProject);
    }else{
        res.status(404).json({error:'Failed to get data by name. Can not delete.'})
    }
})

router.post('/createData', async (req, res) => {
    try {
        const data = await readData();
        const newProject = req.body;

        const projectExists = data.some(p => p.name.toLowerCase() === newProject.name.toLowerCase());

        let projectFormatError = false;

        if (!newProject.name || typeof newProject.name !== "string") {
            projectFormatError = true;
        }

        if (!newProject.users || typeof newProject.users !== "number" || !Number.isInteger(newProject.users)) {
            projectFormatError = true;
        }

        if (!newProject.dashboards || typeof newProject.dashboards !== "number" || !Number.isInteger(newProject.dashboards)) {
            projectFormatError = true;
        }

        if (!newProject.category || typeof newProject.category !== "string") {
            projectFormatError = true;
        }

        if (projectExists) {
            return res.status(400).json({ error: "Failed to add data because the project name has been used." });
        } else if (projectFormatError) {
            return res.status(400).json({ error: "Input format error." });
        } else {
            data.push(newProject);
            await writeData(data);
            res.status(201).json({ message: "Project created successfully", project: newProject });
        }
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});


module.exports = router;
