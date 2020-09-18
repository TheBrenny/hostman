String.prototype.hashCode = function () {
    if (this.hashCoded) return this.hashCoded;

    let h;
    for (let i = 0; i < this.length; i++)
        h = Math.imul(31, h) + this.charCodeAt(i) | 0;

    this.hashCoded = h;
    return h;
};

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

function addNewRow() {
    let last = this.target.parentElement;
    scetchInsert(last, "beforeBegin", scetch.newHost);
    // last.insertAdjacentHTML("beforebegin", row);
    resize();
}

function deleteRow(row) {
    // get hash
    // send to hostile (through /api/ and as a promise) and set to spinner
    // .then success => height of row transitions to 0, delete element
    // .catch error => set as cross.svg, make row red, add error div, wait, delete div, fade to normal
}

function submitToHostile(row) {
    let host = row.children[0].value;
    let address = row.children[1].value;
    if (host.trim().length === 0 || address.trim().length === 0) return false; // TODO: show error instead of nothing!
    hashRow(row);
    // generate hash
    // send to hostile (through /api/ and as a promise) and set to spinner
    // .then success => set as cross.svg, green row, wait, fade to normal
    // .catch error => set as tick.svg, make row red, add error div, wait, delete div, fade to normal
}


function hashRow(row) {
    let s = row.children[0].value + row.children[1].value;
    row.setAttribute("hash", s.hashCode().toString(16));
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
            submitToHostile(target.parentElement);
        }

    };

    window.onresize = resize;
}

(ready)();
(resize)();