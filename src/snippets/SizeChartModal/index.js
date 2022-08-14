/* eslint-disable no-use-before-define */
import './index.scss';

const sizeChartModalTablesDOM = document.getElementById("size-chart-modal-tables");
let tables = null;
if (sizeChartModalTablesDOM) {
  tables = JSON.parse(sizeChartModalTablesDOM.innerHTML);
}

const productImage = document.querySelector("#size-chart-modal .right img");
const productDescription = document.getElementById("product-description");

function initDefaultView() {
  renderTables('Round');
  updateProduct(tables.round.table48Inches[0]);
}

function initTableShapeButtons() {
  const tableShapeDropdown = document.getElementById("table-shape-dropdown");
  if (tableShapeDropdown) {
    tableShapeDropdown.addEventListener('change', (e) => {
      renderTables(e.target.value);
    });
  }
}

/** ********************* Render tables ********************** */

function renderTables(value) {
  let tableSizes = [];
  switch (!!value) {
    case (value === 'Round'):
      tableSizes = ["48\" table", "60\" table", "72\" table"];
      break;
    case (value === 'Square'):
      tableSizes = ["48\" x 48\"", "60\" x 60\"", "72\" x 72\""];
      break;
    case (value === 'Rectangle'):
      tableSizes = ["30\" x 48\"", "30\" x 72\"", "30\" x 96\""];
      break;
    default:
      break;
  }
  const type = value.toLowerCase();
  const tableclothsInfo = Object.keys(tables[type])
    .reduce((acc, key) => {
      acc.push(tables[type][key]);
      return acc;
    }, []);

  renderTableSizesInfo(tableSizes, tableclothsInfo, type);
  renderTableclothsInfo(tableclothsInfo[0], tableSizes, type); // Default view
}

function renderTableSizesInfo(tableSizes, tableclothsInfo, shape) {

  const tableSizeDropdown = document.querySelector('#table-size-dropdown');
  if (tableSizeDropdown) {
    clearContent(tableSizeDropdown);
  }

  for (let i = 0; i < tableSizes.length; i++) {
    const option = document.createElement('option');
    if (option) {
      option.innerHTML = tableSizes[i];
      tableSizeDropdown.appendChild(option);
    }
  }

  tableSizeDropdown.addEventListener('change', (e) => {
    const { selectedIndex } = e.target;
    renderTableclothsInfo(tableclothsInfo[selectedIndex], tableSizes, shape);
  });
}

function renderTableclothsInfo(tableclothsInfo, tableSizes, shape) {
  const clothSizeDropdown = document.querySelector('#cloth-size-dropdown');
  if (clothSizeDropdown) {
    clearContent(clothSizeDropdown);
  }

  tableclothsInfo.forEach((tablecloth) => {
    const option = document.createElement('option')
    if (option) {
      option.innerHTML = tablecloth.name;
      clothSizeDropdown.appendChild(option);
    }
  });

  clothSizeDropdown.addEventListener('change', (e) => {
    const selectedValue = e.target.value;

    tableclothsInfo.forEach((tablecloth) => {
      if (selectedValue === tablecloth.name) {
        updateProduct(tablecloth);
        renderMeasurementGrid(tableclothsInfo, tableSizes, shape);
      }
    });
  });

  updateProduct(tableclothsInfo[0]); // Default view
  renderMeasurementGrid(tableclothsInfo, tableSizes, shape);
}

function renderMeasurementGrid(tableclothsInfo, tableSizesInfo, shape) {
  const tableSize = document.querySelector("#table-size-dropdown").value;
  const clothSize = document.querySelector("#cloth-size-dropdown").value;

  const selectedGrid = document.querySelector(`[data-shape="${shape.toLowerCase().trim()}"]`);
  if (!selectedGrid) return;
  const selectedRow = selectedGrid.querySelector(`[data-size="${formatGridQuery(tableSize)}"]`);
  if (!selectedRow) return;
  const selectedCell = selectedRow.querySelector(`[data-linen="${formatGridQuery(clothSize)}"]`);

  const selectedRowValue = selectedRow.getAttribute('data-row');

  resetGrid();

  // add highlight to selected cell and show selected grid
  document.querySelector(`.${shape.toLowerCase()}-grid`).classList.add('d-block');

  if (selectedCell) {
    selectedCell.classList.add("lightgrey-highlight");
  }

  // add highlight to previous rows
  for (let i = 0; i < selectedRowValue; i++) {
    const previousRow = selectedGrid.querySelector(`[data-row="${i}"]`);
    if (!previousRow) return;
    const previousCell = previousRow.querySelector(`[data-linen="${formatGridQuery(clothSize)}"]`);
    if (!previousCell) return;
    previousCell.classList.add("darkgrey-highlight");
  }


  // add highlight to previous columns
  const parent = selectedCell.parentNode;
  const childen = parent.querySelectorAll('td');
  const index = Array.prototype.indexOf.call(parent.children, selectedCell);

  for (let i = 0; i < index; i++) {
    if (childen[i].classList.contains('header') === false) {
      childen[i].classList.add("darkgrey-highlight");
    }
  }
}


function formatGridQuery(query) {
  return query.replace(/ /g, '').replace(/"/g, '').replace('table', '').trim();
}

function resetGrid() {
  const shownGrid = document.querySelector('.measurement-grid.d-block');
  const orangeHighlight = document.querySelector('.lightgrey-highlight');
  const yellowHighLights = document.querySelectorAll('.darkgrey-highlight');

  if (shownGrid) {
    shownGrid.classList.remove('d-block');
  }

  if (orangeHighlight) {
    orangeHighlight.classList.remove('lightgrey-highlight');
  }

  yellowHighLights.forEach((elem) => {
    elem.classList.remove('darkgrey-highlight');
  });
}


/** ********************* Helpful functions ********************** */

function clearContent(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function updateProductImage(imageURL) {
  productImage.src = imageURL;
}

function updateProductDescription(description) {
  productDescription.innerHTML = description;
}

function updateProduct(product) {
  updateProductImage(product.imageURL);
  updateProductDescription(product.description);
}

export const initSizeChartModal = () => {
  initDefaultView();
  initTableShapeButtons();
};