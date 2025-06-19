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
        this.shadowRoot.innerHTML = `
            <div class="container">    
                <button class="btn" id="toggleTable">Change Display</button>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover" id="ptTable">
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

                    <table class="table table-bordered table-hover" style="" id="letterTable">
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
        `
    }
}

customElements.define("ec-cayleytable", ecCayleyTable)