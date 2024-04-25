import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { KanbanBoard } from './container';

function App() {
  return (
    <ChakraProvider>
      <KanbanBoard />
    </ChakraProvider>
  );
}

export default App;
