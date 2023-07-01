import PropTypes from "prop-types";
import { Box, TableCell, useTheme } from "@mui/material";
import { useMemo } from "react";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const customTableCellVariant = {
  HEAD_CELL: "HEAD_CELL",
  FIRST_HEAD_CELL: "FIRST_HEAD_CELL",
  FIRST_BODY_CELL: "FIRST_BODY_CELL",
  ACTION_BODY_CELL: "ACTION_BODY_CELL"
};

function CustomTableCell({ variant, sx: customSx, align = "left", hide, children, haveSortIcon, id, sort, setSort }) {
  const theme = useTheme();
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

  const [sx, wrapChildren, isHead] = useMemo(() => {
    switch (variant) {
      case customTableCellVariant.HEAD_CELL:
        return [
          {
            ...defaultCellSx,
            ...headCellSx,
            ...customSx
          },
          children,
          true
        ];

      case customTableCellVariant.FIRST_HEAD_CELL:
        return [
          {
            ...defaultCellSx,
            ...firstHeadCellSx,
            ...customSx
          },
          children,
          true
        ];

      case customTableCellVariant.FIRST_BODY_CELL:
        return [
          {
            ...defaultCellSx,
            ...firstBodyCellSx,
            ...customSx
          },
          children,
          false
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
          </Box>,
          false
        ];

      default:
        return [
          {
            ...defaultCellSx,
            ...tableCellSx,
            ...customSx
          },
          children,
          false
        ];
    }
  });

  const renderSortIcon = (idValue, sortValue) => {
    let active = false;
    const isAsc = sortValue?.isAsc;
    if (sortValue?.sortBy === idValue) {
      active = true;
    }

    const sortIconActiveComponent = isAsc ? (
      <Box
        component={FontAwesomeIcon}
        icon={faSortUp}
        color={theme.palette.text.primary}
        sx={{ transform: "translateY(20%)" }}
      />
    ) : (
      <Box
        component={FontAwesomeIcon}
        icon={faSortDown}
        color={theme.palette.text.primary}
        sx={{ transform: "translateY(-20%)" }}
      />
    );

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ml: 1
        }}
      >
        {active ? (
          sortIconActiveComponent
        ) : (
          <FontAwesomeIcon
            icon={faSort}
            // color={active && isAsc ? theme.palette.text.primary : theme.palette.text.disabled}
            color="#aca7a7"
          />
        )}
      </Box>
    );
  };

  return (
    <TableCell align={align} sx={sx} scope="row">
      {isHead ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
          }}
          onClick={() => {
            if (haveSortIcon) {
              const newSort = {
                sortBy: id,
                isAsc: !sort?.isAsc
              };
              setSort({ ...newSort });
            }
          }}
        >
          {wrapChildren}
          {haveSortIcon && renderSortIcon(id, sort)}
        </Box>
      ) : (
        wrapChildren
      )}
    </TableCell>
  );
}

CustomTableCell.defaultProps = {
  variant: undefined,
  sx: {},
  align: "left",
  hide: false,
  children: undefined,
  id: "",
  sort: undefined,
  setSort: undefined,
  haveSortIcon: false
};

CustomTableCell.propTypes = {
  variant: PropTypes.string,
  sx: PropTypes.object,
  align: PropTypes.string,
  hide: PropTypes.bool,
  children: PropTypes.node,
  id: PropTypes.string,
  sort: PropTypes.object,
  setSort: PropTypes.func,
  haveSortIcon: PropTypes.bool
};

export default CustomTableCell;
