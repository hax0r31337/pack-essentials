import React from 'react'
import App from './components/app'
import { createRoot } from 'react-dom/client';
import "./styles.css"


const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);