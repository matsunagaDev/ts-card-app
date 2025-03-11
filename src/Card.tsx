import { Outlet, useParams } from 'react-router';

export const Card = () => {
  let params = useParams();
  return (
    <div>
      <h1 data-testid="title">カード</h1>
      <Outlet />
    </div>
  );
};
