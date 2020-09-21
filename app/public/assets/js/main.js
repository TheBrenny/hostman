let main = $(".main");
let mainScrollTrigger = 0;
let actions = {
    newHost: addNewRow,
    delHost: deleteRow,

    derp: () => {
        scetchInsert($(".row"), scetch.derp, {
            test: "Hello World!"
        });
    }
};

if (typeof globalThis.Exception === "undefined") {
    globalThis.Exception = class Exception {
        constructor(name, msg) {
            if (typeof msg === "undefined") {
                msg = name;
                name = "Exception";
            }

            this.name = name;
            this.message = msg;
        }

        toString() {
            return `${this.name}: "${this.message}"`;
        }
    };
}

function addNewRow() {
    let last = this.target.parentElement;
    scetchInsert(last, "beforeBegin", scetch.newHost);
    resize();
}

function deleteRow(row) {
    // get hash
    // send to hostile (through /api/ and as a promise) and set to spinner
    // .then success => height of row transitions to 0, delete element
    // .catch error => set as cross.svg, make row red, add error div, wait, delete div, fade to normal
}

function submit(row) {
    Promise.resolve().then(() => {
        row.children[2].classList.remove("tick");
        row.children[2].classList.add("spinner");

        let host = row.children[0].value.trim();
        let address = row.children[1].value.trim();
        if (host.length === 0 || address.length === 0) throw new Exception("Host and address cannot be empty!");
        return {
            host: host,
            address: address
        };
    }).then(h => {
        return fetch("/api/hosts", {
            method: "POST",
            body: JSON.stringify(h)
        });
    }).then(res => res.json()).then(json => {
        /*{
            status: 0,
            updated: 1
        };
        */
       let {status, updated} = json;

        if (status === 0 && updated === 1) row.children[2].classList.add("delete");
        else throw (status.message || "Unable to update host...");
    }).catch(e => {
        // TODO: Write an error
        console.error(e);
        row.children[2].classList.add("tick");
    }).finally(() => {
        row.children[2].classList.remove("spinner");
    });
    // send to hostile (through /api/ and as a promise) and set to spinner
    // .then success => set as cross.svg, green row, wait, fade to normal
    // .catch error => set as tick.svg, make row red, add error div, wait, delete div, fade to normal
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function resize() {
    let rows = $$(".row");

    for (let row of rows) {
        if (row.scrollWidth > row.clientWidth) {
            if (!main.classList.contains("overflowing")) {
                main.classList.add("overflowing");
                mainScrollTrigger = row.clientWidth;
                break;
            }
        }
        if (row.clientWidth > mainScrollTrigger && mainScrollTrigger > 0) {
            main.classList.remove("overflowing");
            mainScrollTrigger = 0;
        }
    }
}

function ready() {
    // $$(".btn[action]").forEach(el => {
    //     el.onclick = (data) => {
    //         let a = data.target.getAttribute("action");
    //         if (actions && actions[a]) actions[a].apply(data);
    //     };
    // });

    // $$(".delete").forEach(el => {
    //     el.onclick = (data) => {
    //     };
    // });

    document.onclick = (event) => {
        let target = event.target;

        if (target.matches(".btn[action]")) {
            let a = target.getAttribute("action");
            if (actions && actions[a]) actions[a].apply(event);
        } else if (target.matches(".delete")) {
            deleteRow(target.parentElement);
        } else if (target.matches(".tick")) {
            submit(target.parentElement);
        }
    };

    window.onresize = resize;
}

(ready)();
(resize)();