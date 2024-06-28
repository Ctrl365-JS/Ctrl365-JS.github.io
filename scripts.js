document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'selected' class from all buttons in the same group
        document.querySelectorAll(`.option-button[data-group="${button.dataset.group}"]`).forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add 'selected' class to the clicked button
        button.classList.add('selected');
    });
});

function calculateComplexity() {
    const groups = [
        'steps', 'documentation', 'rules', 'frequency', 'standardization',
        'dataQuality', 'dataModification', 'controls', 'volume', 'calculations',
        'exceptions', 'applications', 'decisions', 'humanDecisions'
    ];

    let totalScore = 0;
    let allSelected = true;
    const results = [];

    // Sum up the scores from selected buttons and check if all groups have a selected button
    groups.forEach(group => {
        const selectedButton = document.querySelector(`.option-button.selected[data-group="${group}"]`);
        if (selectedButton) {
            totalScore += parseInt(selectedButton.dataset.value);
            results.push({
                category: group,
                value: selectedButton.innerText,
                score: selectedButton.dataset.value
            });
        } else {
            allSelected = false;
        }
    });

    if (!allSelected) {
        document.getElementById('result').innerHTML = `
            <p style="color: red;">Por favor, complete todos los campos antes de calcular la complejidad.</p>
        `;
        return;
    }

    let complexity = '';
    let developmentTime = '';
    let productionTime = '';

    if (totalScore >= 14 && totalScore <= 27) {
        complexity = 'Muy Baja';
        developmentTime = '< 40 horas';
        productionTime = '1 a 2 semanas';
    } else if (totalScore >= 28 && totalScore <= 42) {
        complexity = 'Baja';
        developmentTime = '41 a 80 horas';
        productionTime = '2 a 3 semanas';
    } else if (totalScore >= 43 && totalScore <= 55) {
        complexity = 'Media';
        developmentTime = '81 a 200 horas';
        productionTime = '4 a 7 semanas';
    } else if (totalScore >= 55 && totalScore <= 70) {
        complexity = 'Alta';
        developmentTime = '> 201 horas';
        productionTime = '8 a 10 semanas';
    }

    // Mostrar el resultado
    document.getElementById('result').innerHTML = `
        <p>Puntaje: ${totalScore}</p>
        <p>Complejidad: ${complexity}</p>
        <p>Tiempo de Desarrollo: ${developmentTime}</p>
        <p>Tiempo de Pase a Producción: ${productionTime}</p>
    `;

    // Generar y descargar el archivo Excel
    const wb = XLSX.utils.book_new();
    const wsData = [
        ['Categoría', 'Descripción', 'Puntuación'],
        ...results.map(r => [r.category, r.value, r.score]),
        [],
        ['Complejidad', complexity],
        ['Tiempo de Desarrollo', developmentTime],
        ['Tiempo de Pase a Producción', productionTime],
        ['Puntaje obtenido', totalScore]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ajustar el ancho de las columnas A, B, y C al contenido
    const columnWidths = [
        { wch: 25 }, // Ancho de la columna A
        { wch: 35 }, // Ancho de la columna B
        { wch: 10 }  // Ancho de la columna C
    ];

    // Aplicar los anchos de columna
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'Resultados_Complejidad.xlsx');
}
