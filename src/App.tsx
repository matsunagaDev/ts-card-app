import { BrowserRouter, Route, Routes } from 'react-router';
import { UserCard } from './components/UserCard';
import { Box } from '@chakra-ui/react';
import { Register } from './components/register';
import { Home } from './components/Home';

export const App = () => {
  return (
    <BrowserRouter>
      <Box p={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards/:id" element={<UserCard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
