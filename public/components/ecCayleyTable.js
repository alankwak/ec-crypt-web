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
                    width: 100%;
                    max-width: 80vw;
                    overflow-x: auto;
                    border-radius: 8px;
                    border: 1px solid #ddd;
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
                }

                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }

                td {
                    background-color: #ffffff;
                }
            </style>
        
            <div>    
                <button id="toggleTable">Change Display</button>
                <div class="table-wrapper">
                    <table id="ptTable">
                        <thead>
                            <th>Cayley Table</th>
                            ${this.cthead.map(h => `<th>(${h})</th>`).join('')}
                        </thead>
                        
                        <tbody>
                            ${this.ctbody.map((r, index) => {
                                return `
                                <tr>
                                    <th>(${this.cthead[index]})</th>
                                    ${r.map(point => `<td>(${point})</td>`).join('')}
                                <tr>`
                            }).join('')}
                        </tbody>
                    </table>

                    <table style="display: none" id="letterTable">
                        <thead>
                            <th>Letter Key</th>
                            ${this.echead.map(h => `<th>'${h}'</th>`).join('')}
                        </thead>
                        
                        <tbody>
                            ${this.ecbody.map((r, index) => {
                                    return `
                                    <tr>
                                        <th>'${this.echead[index]}'</th>
                                        ${r.map(letter => `<td>'${letter}'</td>`).join('')}
                                    <tr>`
                                }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : '';

        const toggleButton = this.shadowRoot.getElementById('toggleTable');
        const ptTable = this.shadowRoot.getElementById('ptTable');
        const letterTable = this.shadowRoot.getElementById('letterTable');
        if(toggleButton) {
            toggleButton.addEventListener('click', e => {
                if (ptTable.style.display === 'none') {
                    ptTable.style.display = 'inline-table';
                    letterTable.style.display = 'none';
                } else {
                    ptTable.style.display = 'none';
                    letterTable.style.display = 'inline-table';
                }
            });
        }
    }
}

customElements.define("ec-cayleytable", ecCayleyTable)