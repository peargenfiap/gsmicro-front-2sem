// Function to create a modal with a placeholder for the metrics table
function createModal() {
    // If a modal already exists, remove it to avoid duplicates
    const existingModal = document.getElementById('indicatorModal');
    if (existingModal) {
        existingModal.parentNode.removeChild(existingModal);
    }

    // Modal structure
    const modalHtml = `
        <div class="modal fade" id="indicatorModal" tabindex="-1" role="dialog" aria-labelledby="indicatorModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="indicatorModalLabel">Detalhes do Indicador</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Dynamic content will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Function to populate the modal with indicator data and metrics
function populateModal(indicator, metrics) {
    // Call this first to ensure we're working with a clean modal
    createModal();

    const modalBody = document.querySelector('#indicatorModal .modal-body');

    // Add the indicator details to the modal body
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <strong class="consume-label">Chave:</strong> ${indicator.odsKey}
            </div>
            <div class="col-md-6">
                <strong class="consume-label">Indicador:</strong> ${indicator.indicatorKey}
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong class="consume-label">Descrição:</strong> ${indicator.indicatorDescription}
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong class="consume-label">Nome:</strong> ${indicator.indicatorName}
            </div>
        </div>
        <!-- Placeholder for Metrics Table -->
        <h6 class="mt-4">Métricas</h6>
        <table class="table table-bordered table-dark" id="metrics-table">
            <thead>
                <tr>
                    <th>Ano</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
                ${metrics.map(metric => `
                    <tr>
                        <td>${metric.consumeYear}</td>
                        <td>${metric.consumeQuantity}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Show the modal
    $('#indicatorModal').modal('show');
}

// Function to handle row click
function handleRowClick(indicator) {
    // Fetch the metrics for the selected indicator
    fetch(`http://localhost:8080/v1/consume/porindicador?indicatorKey=${indicator.indicatorKey}`)
        .then(response => response.json())
        .then(metrics => {
            // Populate the modal with the indicator data and fetched metrics
            populateModal(indicator, metrics);
        })
        .catch(error => {
            console.error('Error fetching metric details:', error);
        });
}

// ... rest of the code remains unchanged ...

// Fetching the initial data to populate the table
fetch('http://localhost:8080/v1/indicator/')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('indicator-table-body');
        data.forEach(indicator => {
            const row = `
                <tr data-indicator-key="${indicator.indicatorKey}">
                    <td>${indicator.indicatorKey}</td>
                    <td>${indicator.indicatorDescription}</td>
                    <td>${indicator.indicatorName}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Attach click event listeners to each row
        document.querySelectorAll('#indicator-table-body tr').forEach(row => {
            row.addEventListener('click', () => {

                const indicatorKey = row.getAttribute('data-indicator-key');
                const selectedRowData = data?.find((indicator) => indicator.indicatorKey === indicatorKey);

                handleRowClick(selectedRowData);
            });
        });
    })
    .catch(error => console.error('Error fetching indicators:', error));
