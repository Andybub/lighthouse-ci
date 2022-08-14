import './MyPagination.scss';
import { Pagination } from '@material-ui/lab';
import { useModalContext } from '@/react/contexts/STLModal';

const MyPagination = ({ total }) => {
  // console.log("MyPagination.js");

  const { page, setPage } = useModalContext();

  const handleChange = (e, page) => {
    // console.log("handleChange");
    // console.log("page", page);
    setPage(page);
  };

  return (
    <div className="stl-pagination-container">
      <Pagination count={total} page={page} onChange={handleChange} />
    </div>
  );
};

export default MyPagination;
