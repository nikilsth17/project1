import React, { useState } from 'react';
import axios from 'axios';

export default function Dummypage() {
  const [file, setFile] = useState(null);
  const [testCaseId, setTestCaseId] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [status, setStatus] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('File', file);
    formData.append('TestCaseId', testCaseId);
    formData.append('ActualResult', actualResult);
    formData.append('Status', status);

    try {
    const apiUrl = window.APP_CONFIG.baseapi + '/TestResult';

    const token = localStorage.getItem("token"); // Example: token stored in local storage
  console.log("project token", token)

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };

      const response = await axios.post(`${apiUrl}/CreateTestResult`, formData, {
       headers
      });

      console.log('Response:', response.data);
      // Handle the response as needed.
    } catch (error) {
      console.error('Error:', error);
      // Handle errors.
    }
  };

  return (
    <div className='mt-5 pt--5'>
      <h1 className='mt-5 pt-5'>Upload File and Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>File:</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
        </div>
        <div>
          <label>TestCaseId:</label>
          <input type="number" value={testCaseId} onChange={(e) => setTestCaseId(e.target.value)} />
        </div>
        <div>
          <label>ActualResult:</label>
          <input type="text" value={actualResult} onChange={(e) => setActualResult(e.target.value)} />
        </div>
        <div>
          <label>Status:</label>
          <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}


