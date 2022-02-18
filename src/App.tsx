import React, { useEffect, useState } from 'react';
import './App.css';
import Form from './Components/Form';
// import MultipleSelect from './Components/MultipleSelect';

function App() {
  const [campaigns, setCampaigns] = useState();

  useEffect(() => {
    fetch(`http://localhost:5000/api/campaign`).then(res => res.json()).then(data => setCampaigns(data))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {campaigns && <Form values={campaigns} />}
      </header>

    </div>
  );
}

export default App;
