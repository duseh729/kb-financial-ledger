export function getChartColors(length) {

    const colorPalette = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    const colors = [];
    for (let i = 0; i < length; i++) {
        colors.push(colorPalette[i % colorPalette.length]);
    }
    
    return colors;
}