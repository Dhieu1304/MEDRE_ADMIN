import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import qs from "query-string";
import { Box, Pagination } from "@mui/material";
import NoDataBox from "./NoDataBox";

function ListPageTableWrapper({ table, count, watch, loadData, setValue }) {
  const navigate = useNavigate();

  return count ? (
    <>
      {table}

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
        <Pagination
          count={Math.ceil(count / watch().limit)}
          color="primary"
          page={watch().page}
          sx={{
            display: "flex",
            justifyContent: "flex-end"
          }}
          onChange={(event, newPage) => {
            setValue("page", newPage);
            const params = { ...watch(), page: newPage };
            const searchParams = qs.stringify(params);
            navigate(`?${searchParams}`);
            loadData({ page: newPage });
          }}
        />
      </Box>
    </>
  ) : (
    <NoDataBox />
  );
}

ListPageTableWrapper.propTypes = {
  table: PropTypes.node.isRequired,
  count: PropTypes.number.isRequired,
  watch: PropTypes.func.isRequired,
  loadData: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired
};

export default ListPageTableWrapper;
