import React, { useEffect,useState } from 'react';
import { useApp } from "contexts";
import { HistoryService } from "services";
import "assets/styles/history.css";

export const History = () => {
  const [name, setName] = useState('');
  const [historyData, setHistoryData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await HistoryService.getPetHistory(name);
      if (response.status === 'SUCCESS') {
        setHistoryData(response.payload);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error retrieving pet history');
    }
  };

  return (
    <div className="table-responsive">
      <h1>Pet History</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Pet Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="submit">Search</button>
      </form>
      {historyData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Appointment Date</th>
              <th>Treatment Medication</th>
              <th>Pet Vaccination</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((history, index) => (
              <tr key={index}>
                <td>{history.petName}</td>
                <td>{new Date(history.date).toLocaleDateString()}</td>
                <td>
                  {history.medications.map((medication, index) => (
                    <div key={index}>
                      {medication.name} - {medication.dosage}
                    </div>
                  ))}
                </td>
                <td>{history.vaccinations.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
