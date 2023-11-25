// Function to create a modal with a placeholder for the metrics table
function createModal(indicator) {
    return `
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
                                <!-- Metrics data will be inserted here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to handle row click and fetch metric details
function handleRowClick(indicator) {
    // Create and insert the modal HTML
    const modalHtml = createModal(indicator);
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const $modal = $('#indicatorModal');

    // Fetch the metrics for the selected indicator
    fetch(`http://localhost:8080/v1/consume/porindicador?indicatorKey=${indicator.indicatorKey}`)
        .then(response => response.json())
        .then(metrics => {
            // Assuming 'metrics' is an array of metric objects
            const metricsTableBody = $modal.find('#metrics-table tbody');
            metrics.forEach(metric => {
                metricsTableBody.append(`
                    <tr>
                        <td>${metric.consumeYear}</td>
                        <td>${metric.consumeQuantity}</td>
                    </tr>
                `);
            });
            $modal.modal('show');
        })
        .catch(error => {
            console.error('Error fetching metric details:', error);
            $modal.modal('hide');
        });
}
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
