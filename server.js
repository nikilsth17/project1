const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

// Define routes for each JSON file
const dataPath1 = path.join("Json", 'module.json');
const dataPath2 = path.join("Json", 'project.json');
const dataPath3 = path.join("Json", 'testcase.json');
const dataPath4 = path.join("Json", 'testresult.json');
const dataPath5 = path.join("Json", 'user.json');

const getData = (dataPath) => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    console.log(error);
    return null;
  }
};

const writeDataToFile = (dataPath, data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};


//******************************** Test Cases ********************************
//get all test cases
app.get('/api/testcase', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath3, 'utf8'));
    res.json(data);
  } catch (error) {
    console.log(error)  
  }

});
// get all testcases for module // get all testcases for module // get all testcases for module 
app.get('/api/module/:moduleId/testcases', (req, res) => {
  const moduleId = req.params.moduleId;
  const testcaseData = getData(dataPath3);

  if (testcaseData) {
    const moduleTestcases = testcaseData.filter(testcase => testcase.module_id === moduleId);

    console.log('testcaseData', testcaseData)
    res.json(moduleTestcases);
    console.log("Module TestCases", moduleTestcases)
  } else {
    res.status(500).json({ error: 'Server error' });
  }
});

// add testcase for module
app.post('/api/module/:moduleId/testcase', (req, res) => {

  try {
    const moduleId = req.params.moduleId;
    const existingTestcases = JSON.parse(fs.readFileSync(dataPath3, 'utf8'));
    const newTestcase = {
      ...req.body,
      module_id: moduleId,
    };
    existingTestcases.push(newTestcase);
    writeDataToFile(dataPath3, existingTestcases);
    res.status(201).json(newTestcase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }

})

//update testcase by id
app.put('/api/testcase/:id', (req, res) => {
   try {
    const testcaseId = req.params.id;
    const updatedTestcaseData = req.body;
    const existingTestcases = JSON.parse(fs.readFileSync(dataPath3, 'utf8'));
    // console.log('Updating testcase with ID:', testcaseId);
    // console.log('Existing data:', existingTestcases);
    // Find the index of the testcase with the specified ID
    const testcaseIndex = existingTestcases.findIndex(testcase => testcase.id === testcaseId);
    console.log('Testcase index:', testcaseIndex);
    if (testcaseIndex !== -1 || null) {
      // Update the testcase data
      existingTestcases[testcaseIndex] = {
        ...existingTestcases[testcaseIndex],
        ...updatedTestcaseData,
      };
      writeDataToFile(dataPath3, existingTestcases);
      res.status(200).json(existingTestcases[testcaseIndex]);
    } else {
      console.log('Testcase not found');
      res.status(404).json({ error: 'Testcase not found' });
    }
   } catch (error) {
    console.log(error);
   }
})

//delete testcase by id
app.delete('/api/testcase/:id', (req, res) => {
  try {
    const testcaseId = req.params.id;
    const existingTestcases = JSON.parse(fs.readFileSync(dataPath3, 'utf8'));
    // Find the index of the testcase with the specified ID
    const testcaseIndex = existingTestcases.findIndex(testcase => testcase.id === testcaseId);
    if (testcaseIndex !== -1) {
      // Remove the testcase from the array
      const deletedTestcase = existingTestcases.splice(testcaseIndex, 1)[0];
      writeDataToFile(dataPath3, existingTestcases);
      res.status(200).json(deletedTestcase);
    } else {
      res.status(404).json({ error: 'Testcase not found' });
    }
    
  } catch (error) {
    console.log(error)
  }
});



//******************************** MODULES ********************************

//get all modules
app.get('/api/modules', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath1, 'utf8'));
    res.json(data);
  } catch (error) {
    console.log(error)
  }
 
});




// get all modules for project
app.get('/api/project/:projectId/modules', (req, res) => {
  const projectId = req.params.projectId;
  // console.log("projectId", projectId)
  const moduleData = getData(dataPath1);

  if (moduleData) {
    const projectModules = moduleData.filter(module => module.project_id === projectId);
    // console.log('moduleData', moduleData)
    res.json(projectModules);
   
  } else {
    res.status(500).json({ error: 'Server error' });
  }
});
// add module for project 
app.post('/api/project/:projectId/module', (req, res) => {
  try {
    const projectId = req.params.projectId;
    const existingModules = JSON.parse(fs.readFileSync(dataPath1, 'utf8'));
    const newModule = {
      ...req.body,
      project_id: projectId,
    };
    existingModules.push(newModule);
    writeDataToFile(dataPath1, existingModules);
    res.status(201).json(newModule);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//update module by id
app.put('/api/module/:id', (req, res) => {
  try {
    const moduleId = req.params.id;
    const updatedModuleData = req.body;
    const existingModules = JSON.parse(fs.readFileSync(dataPath1, 'utf8'));
    // console.log('Updating module with ID:', moduleId);
    // console.log('Existing data:', existingModules);
    // Find the index of the module with the specified ID
    const moduleIndex = existingModules.findIndex(module => module.id === moduleId);
    console.log('Module index:', moduleIndex);
    if (moduleIndex !== -1) {
      // Update the module data
      existingModules[moduleIndex] = {
        ...existingModules[moduleIndex],
        ...updatedModuleData,
      };
      writeDataToFile(dataPath1, existingModules);
      res.status(200).json(existingModules[moduleIndex]);
    } else {
      console.log('Module not found');
      res.status(404).json({ error: 'Module not found' });
    }
    
  } catch (error) {
    console.log(error)
  }
})

//delete module by id 
app.delete('/api/module/:id', (req, res) => {
  try {
    const moduleId = req.params.id;
    const existingModules = JSON.parse(fs.readFileSync(dataPath1, 'utf8'));
    // Find the index of the module with the specified ID
    const moduleIndex = existingModules.findIndex(module => module.id === moduleId);
    if (moduleIndex !== -1) {
      // Remove the module from the array
      const deletedModule = existingModules.splice(moduleIndex, 1)[0];
      writeDataToFile(dataPath1, existingModules);
      res.status(200).json(deletedModule);
    } else {
      res.status(404).json({ error: 'Module not found' });
    }
    
  } catch (error) {
    console.log(error)
  }
})






//******************************** PROJECTS ********************************


app.get('/api/project', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath2, 'utf8'));
    res.json(data);
    
  } catch (error) {
    console.log(error)
  }
  
});

//create a new project
app.post('/api/project', (req, res) => {
  try {
    const existingProjects = JSON.parse(fs.readFileSync(dataPath2, 'utf8'));
    const newProject = {
      ...req.body,
    };
    existingProjects.push(newProject);
    writeDataToFile(dataPath2, existingProjects);
    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//update project by id
app.put('/api/project/:id', (req, res) => {
    try {
        const projectId = req.params.id;
        const updatedProjectData = req.body;
        const existingProjects = JSON.parse(fs.readFileSync(dataPath2, 'utf8'));
        console.log('Updating project with ID:', projectId);
        console.log('Existing data:', existingProjects);
        // Find the index of the project with the specified ID
        
        const projectIndex = existingProjects.findIndex(project => project.id ===projectId);
        console.log('Project index:', projectIndex);
        if (projectIndex !== -1 || null) {
          // Update the project data
          existingProjects[projectIndex] ={
            ...existingProjects[projectIndex],
            ...updatedProjectData,
          };
          writeDataToFile(dataPath2, existingProjects);
          res.status(200).json(existingProjects[projectIndex]);
        }
        else{
          console.log('Project not found');
          res.status(404).json({ error: 'Project not found' });
          
        }
       

    } catch (error) {
      console.log(error)
    }
});
//delete project by id
app.delete('/api/project/:id', (req, res) => {
  try {
    const projectId = req.params.id;
    const existingProjects = JSON.parse(fs.readFileSync(dataPath2, 'utf8'));
    // Find the index of the project with the specified ID
    const projectIndex = existingProjects.findIndex(project => project.id === projectId);
    if (projectIndex !== -1 || null) {
      // Remove the project from the array
      const deletedProject = existingProjects.splice(projectIndex, 1)[0];
      writeDataToFile(dataPath2, existingProjects);
      res.status(200).json(deletedProject);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
    
  } catch (error) {
    console.log(error)
  }

})



//******************************** TEST RESULTS ********************************



app.get('/api/testresults', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath4, 'utf8'));
    res.json(data);
  } catch (error) {
    console.log(error)
  }
  
});

//get all test results for testcase
app.get('/api/testcase/:testcaseId/testresults', (req, res) => {
  const testcaseId = req.params.testcaseId;
  const testresultData = getData(dataPath4);

  if (testresultData) {
    const testcaseTestresults = testresultData.filter(testresult => testresult.testcase_id === testcaseId);

    console.log('testresultData', testresultData)
    res.json(testcaseTestresults);
    console.log("Testcase TestResults", testcaseTestresults)
  } else {
    res.status(500).json({ error: 'Server error' });
  }
})

// add test result for test case
app.post('/api/testcase/:testcaseId/testresult', (req, res) => {
  try {
    const testcaseId = req.params.testcaseId;
    const existingTestresults = JSON.parse(fs.readFileSync(dataPath4, 'utf8'));
    const newTestresult = {
      ...req.body,
      testcase_id: testcaseId,
    };
    existingTestresults.push(newTestresult);
    writeDataToFile(dataPath4, existingTestresults);
    res.status(201).json(newTestresult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
})



//******************************** USER MANAGEMENT ********************************

//get all users
app.get('/api/user', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath5, 'utf8'));
    res.json(data);
  } catch (error) {
    console.log(error)
  }
 
});

//create user
app.post('/api/user', (req, res) => {
  try {
    const existingData = JSON.parse(fs.readFileSync(dataPath5, 'utf8'));
    const newUser = {
      ...req.body,
    };
    existingData.push(newUser);
    writeDataToFile(dataPath5, existingData);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// delete user by id
app.delete('/api/user/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const existingData = JSON.parse(fs.readFileSync(dataPath5, 'utf8'));
    
    // Find the index of the user with the specified ID
    const userIndex = existingData.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      // Remove the user from the array
      const deletedUser = existingData.splice(userIndex, 1)[0];
      writeDataToFile(dataPath5, existingData);
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//update user information
app.put('/api/user/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    const existingData = JSON.parse(fs.readFileSync(dataPath5, 'utf8'));


    console.log('Updating user with ID:', userId);
    console.log('Existing data:', existingData);

    // Find the index of the user with the specified ID
    const userIndex = existingData.findIndex(user => user.id === userId);
    console.log('User index:', userIndex);

    if (userIndex !== -1) {
      // Update the user data
      existingData[userIndex] = {
        ...existingData[userIndex],
        ...updatedUserData,
      };

      writeDataToFile(dataPath5, existingData);
      res.status(200).json(existingData[userIndex]);
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
