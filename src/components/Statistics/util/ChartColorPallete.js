export function getChartColors(length) {

    const colorPalette = [
        '#36A2EB', '#4BC0C0', '#FFCD56', '#FF9F40', '#FF6384', '#9966FF'
    ];
    const colors = [];
    for (let i = 0; i < length; i++) {
        colors.push(colorPalette[i % colorPalette.length]);
    }
    
    return colors;
}