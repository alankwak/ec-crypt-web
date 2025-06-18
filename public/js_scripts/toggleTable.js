document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleTable');
    const ptTable = document.getElementById('ptTable');
    const letterTable = document.getElementById('letterTable');

    toggleButton.addEventListener('click', function () {
        if (ptTable.style.display === 'none') {
            ptTable.style.display = 'inline-table';
            letterTable.style.display = 'none';
        } else {
            ptTable.style.display = 'none';
            letterTable.style.display = 'inline-table';
        }
    });
});
