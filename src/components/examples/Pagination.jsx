import { useCallback, useState } from 'react';
import {
    Pagination,
    Paper,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    makeStyles,
} from '@ellucian/react-design-system/core';

import { widthFluid } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()((theme) => ({
    root: {
        width: widthFluid,
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: '31.250rem',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}));

const customId = 'PaginationWithTable';

/**
 * Table with Pagination
 */
const PaginationWithTableExamples = () => {
    const { classes } = useStyles();
    const [data] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // const fetchData = useCallback((nextPage, nextRowsPerPage) => {
    //     fetch(`https://jsonplaceholder.typicode.com/todos?_page=${nextPage + 1}&_limit=${nextRowsPerPage}`)
    //         .then(response => response.json())
    //         .then(json => setData(json));
    // }, []);

    // useEffect(() => {
    //     fetchData(page, rowsPerPage);
    // }, [fetchData, page, rowsPerPage]);

    const handleChangePage = useCallback((_event, nextPage) => {
        setPage(nextPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(event.target.value);
    }, []);

    return (
        <div id={`${customId}_Container`}>
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>Todo Summary</TableCell>
                                <TableCell>Completed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((n) => (
                                <TableRow key={n.id}>
                                    <TableCell component="th" scope="row">
                                        {n.userId}
                                    </TableCell>
                                    <TableCell>{n.title}</TableCell>
                                    <TableCell>{`${n.completed}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination
                    count={200}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

// hide-code-start
PaginationWithTableExamples.documentationElement = (
    <Typography gutterBottom>
        This example demonstrates how to use the <code>Pagination</code> component with a table.
        It also showcases how to work with APIs to update the table dynamically.
        <br />
        <strong>Note: </strong>
        Make sure to wrap the table in a <code>Paper</code> component for better styling and to ensure the <code>Pagination</code> component works as expected.
    </Typography>
);
// hide-code-end

export default PaginationWithTableExamples;
