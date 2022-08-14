import { createRoot } from 'react-dom/client';
import Page from '@/react/pages/stl/Page';

const dom = document.getElementById('tw-stl-app');
const root = createRoot(dom);
root.render(<Page />);
