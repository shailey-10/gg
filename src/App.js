import { useState  } from 'react';
import './App.css';
import Analytics from './components/Analytics';
import { DisplayContext } from './contexts/displayContext';
function App() {

  const [hiddenColumns, setHiddenColumns] = useState()

  return (
    <DisplayContext.Provider value={{hiddenColumns, setHiddenColumns}}>
    <div className="App">
     <Analytics />
    </div>
    </DisplayContext.Provider>
  );
}

export default App;
