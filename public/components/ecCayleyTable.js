class ecCayleyTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.cthead = [];
        this.ctbody = [];
        this.echead = [];
        this.ecbody = [];
    }

    static get observedAttributes() {
        return ['ecinfo'];
    }

    async attributeChangedCallback(name, oldVal, newVal) {
        if(name == "ecinfo") {
            const info = JSON.parse(newVal);
            this.cthead = info.cthead;
            this.ctbody = info.ctbody;
            this.echead = info.echead;
            this.ecbody = info.ecbody;
        }
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = this.cthead.length !== 0 ? `
            <style>
                :host {
                    font-family: Arial, sans-serif;
                    margin-top: 30px;
                    display: flex;
                    justify-content: center;
                }

                #toggleTable {
                    margin-bottom: 12px;
                    padding: 8px 16px;
                    font-size: 14px;
                    border: none;
                    border-radius: 6px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                #toggleTable:hover {
                    background-color: #0056b3;
                }

                .table-wrapper {
                    display: flex;
                    align-items: flex-start;
                    width: 100%;
                    max-width: 80vw;
                    border: 1px solid #ddd;
                }
                .table-sub-wrapper {
                    overflow-x: auto;
                }
                @media( max-width: 700px) {
                    .table-wrapper {
                        max-width: 95vw;
                    }
                }

                table {
                    border-collapse: collapse;
                    table-layout: auto;
                    white-space: nowrap;
                    font-family: monospace;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 6px 12px;
                    font-size: 12px;
                    text-align: center;
                    height: 20px;
                }

                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }

                td {
                    background-color: #ffffff;
                }

                .highlight {
                    background-color: aliceblue;
                }
            </style>
        
            <div>    
                <button id="toggleTable">Change Display</button>
                <div class="table-wrapper">
                    <table id="ptTableLeft">
                        <thead><th>Cayley Table</th></thead>
                        <tbody>
                            ${this.cthead.map(h => `<tr><th>(${h})</th></tr>`).join('')}
                        </tbody>
                    </table>

                    <table id="letterTableLeft" style="display: none">
                        <thead><th>Letter Table</th></thead>
                        <tbody>
                            ${this.echead.map(h => `<tr><th>'${h}'</th></tr>`).join('')}
                        </tbody>
                    </table>

                    <div class="table-sub-wrapper">
                        <table id="ptTable">
                            <thead>
                                ${this.cthead.map(h => `<th>(${h})</th>`).join('')}
                            </thead>
                            
                            <tbody>
                                ${this.ctbody.map((r) => {
                                    return `
                                    <tr>
                                        ${r.map(point => `<td>(${point})</td>`).join('')}
                                    <tr>`
                                }).join('')}
                            </tbody>
                        </table>

                        <table style="display: none" id="letterTable">
                            <thead>
                                ${this.echead.map(h => `<th>'${h}'</th>`).join('')}
                            </thead>
                            
                            <tbody>
                                ${this.ecbody.map((r) => {
                                        return `
                                        <tr>
                                            ${r.map(letter => `<td>'${letter}'</td>`).join('')}
                                        <tr>`
                                    }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ` : '';

        const toggleButton = this.shadowRoot.getElementById('toggleTable');
        const ptTable = this.shadowRoot.getElementById('ptTable');
        const ptTableL = this.shadowRoot.getElementById('ptTableLeft');
        const letterTable = this.shadowRoot.getElementById('letterTable');
        const letterTableL = this.shadowRoot.getElementById('letterTableLeft');
        if(toggleButton) {
            toggleButton.addEventListener('click', e => {
                if (ptTable.style.display === 'none') {
                    ptTable.style.display = 'inline-table';
                    ptTableL.style.display = 'inline-table'
                    letterTable.style.display = 'none';
                    letterTableL.style.display = 'none';
                } else {
                    ptTable.style.display = 'none';
                    ptTableL.style.display = 'none';
                    letterTable.style.display = 'inline-table';
                    letterTableL.style.display = 'inline-table';
                }
            });

            function highlightTable(e) {
                const cell = e.target.closest("td");
                if (!cell) return;

                const row = cell.parentElement;
                const bodyRows = this.tBodies[0].rows;
                const rowIndex = [...this.rows].indexOf(row);
                const cellIndex = [...cell.parentElement.children].indexOf(cell);

                // Highlight cells in the same row up to the hovered cell
                for (let i = 0; i <= cellIndex; i++) {
                    row.children[i].classList.add("highlight");
                }

                // Highlight cells in the same column up to the hovered cell
                // this.rows[0].children[cellIndex].classList.add("highlight");
                for (let i = 0; i <= rowIndex; i++) {
                    const targetRow = bodyRows[i];
                    const colCell = targetRow.children[cellIndex];
                    if (colCell) colCell.classList.add("highlight");
                }
            }
            function unhighlightTable() {
                this.querySelectorAll("td").forEach(td => td.classList.remove("highlight"));
                this.querySelectorAll("th").forEach(th => th.classList.remove("highlight"));
            }

            ptTable.addEventListener("mouseover", highlightTable);
            ptTable.addEventListener("mouseout", unhighlightTable);

            letterTable.addEventListener("mouseover", highlightTable);
            letterTable.addEventListener("mouseout", unhighlightTable);
        }
 
    }

}

customElements.define("ec-cayleytable", ecCayleyTable)