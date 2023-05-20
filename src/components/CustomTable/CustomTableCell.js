import PropTypes from "prop-types";
import { Box, TableCell } from "@mui/material";
import { useMemo } from "react";

export const customTableCellVariant = {
  HEAD_CELL: "HEAD_CELL",
  FIRST_HEAD_CELL: "FIRST_HEAD_CELL",
  FIRST_BODY_CELL: "FIRST_BODY_CELL",
  ACTION_BODY_CELL: "ACTION_BODY_CELL"
};

function CustomTableCell({ variant, sx: customSx, align = "left", hide, children }) {
  const defaultCellSx = {
    display: hide ? "none" : "table-cell"
  };

  const headCellSx = {
    fontWeight: 600,
    zIndex: 2
  };

  const firstHeadCellSx = {
    ...headCellSx,
    position: "sticky",
    left: 0,
    zIndex: 4
  };

  const firstBodyCellSx = {
    display: "table-cell",
    position: "sticky",
    left: 0,
    zIndex: 2,
    minWidth: 120,
    backgroundColor: "white"
  };

  const tableCellSx = {};

  const [sx, wrapChildren] = useMemo(() => {
    switch (variant) {
      case customTableCellVariant.HEAD_CELL:
        return [
          {
            ...defaultCellSx,
            ...headCellSx,
            ...customSx
          },
          children
        ];

      case customTableCellVariant.FIRST_HEAD_CELL:
        return [
          {
            ...defaultCellSx,
            ...firstHeadCellSx,
            ...customSx
          },
          children
        ];

      case customTableCellVariant.FIRST_BODY_CELL:
        return [
          {
            ...defaultCellSx,
            ...firstBodyCellSx,
            ...customSx
          },
          children
        ];

      case customTableCellVariant.ACTION_BODY_CELL:
        return [
          {
            ...defaultCellSx,
            ...tableCellSx,
            ...customSx
          },

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            {children}
          </Box>
        ];

      default:
        return [
          {
            ...defaultCellSx,
            ...tableCellSx,
            ...customSx
          },
          children
        ];
    }
  });

  return (
    <TableCell align={align} sx={sx} scope="row">
      {wrapChildren}
    </TableCell>
  );
}

CustomTableCell.defaultProps = {
  variant: undefined,
  sx: {},
  align: "left",
  hide: false,
  children: undefined
};

CustomTableCell.propTypes = {
  variant: PropTypes.string,
  sx: PropTypes.object,
  align: PropTypes.string,
  hide: PropTypes.bool,
  children: PropTypes.node
};

export default CustomTableCell;
