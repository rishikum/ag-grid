var gridOptions = {
    columnDefs: [
        { field: 'a' },
        { field: 'b' },
        { field: 'c' },
        { field: 'd' },
        { field: 'e' },
        { field: 'f' },
        { field: 'g' },
        { field: 'h' },
    ],
    defaultColDef: {
        flex: 1,
        editable: true,
    },
    rowData: getRows(),
    enableRangeSelection: true,
    enableFillHandle: true,
    undoRedoCellEditing: true,
    undoRedoCellEditingLimit: 5,
    enableCellChangeFlash: true,
};

function undo() {
    gridOptions.api.undoCellEditing();
}

function redo() {
    gridOptions.api.redoCellEditing();
}

function getRows() {
    return Array.apply(null, Array(100)).map(function (_, i) {
        return {
            a: 'a-' + i, b: 'b-' + i, c: 'c-' + i, d: 'd-' + i,
            e: 'e-' + i, f: 'f-' + i, g: 'g-' + i, h: 'h-' + i
        }
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
