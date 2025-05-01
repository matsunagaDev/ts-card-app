import { BrowserRouter, Route, Routes } from 'react-router';
import { UserCard } from './components/UserCard';
import { Box } from '@chakra-ui/react';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { Edit } from './components/Edit';

export const App = () => {
  return (
    <BrowserRouter>
      <Box p={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards/:id" element={<UserCard />} />
          <Route path="/cards/:id/edit" element={<Edit />} />
          <Route path="/cards/register" element={<Register />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
