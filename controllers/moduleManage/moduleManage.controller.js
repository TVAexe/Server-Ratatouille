import connection from "../../database/dbConnect.js";

const moduleManageController = {
    getModules: (req, res) => {
        const { course_id } = req.body;
        if (!course_id) {
            return res.status(400).send('Missing required field: course_id');
        }
        const query = `SELECT * FROM modules WHERE course_id = ?`;
        connection.query(query, [course_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'No modules found for this course' });
            }
            return res.status(200).json(result); // Send the results as JSON
        });
    },

    addModule: (req, res) => {
        const { course_id, module_name, description} = req.body;
        if (!course_id || !module_name || !description) {
            return res.status(400).send('Missing required fields: course_id, module_name, description');
        }
        const query = `INSERT INTO modules (course_id, module_name, description) VALUES (?, ?, ?)`;
        connection.query(query, [course_id, module_name, description], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }
            const newModule = {
                module_id: result.insertId,
                course_id,
                module_name,
                description,
            }
            return res.status(201).json({ message: 'Module added successfully', newModule });
        });
    }
};

export default moduleManageController