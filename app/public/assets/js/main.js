let main = $(".main");
let mainScrollTrigger = 0;
let greenRowColor = "#88FF667F";
let redRowColor = "#E774747F";
let actions = {
    newHost: addNewRow
};

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function $addEvent(element, event, strict, cb) {
    if (typeof cb === "undefined") {
        cb = strict;
        strict = {};
    }
    strict = strict || {};
    element.addEventListener(event, element.fn = (e) => {
        for (let o in strict)
            if (e[o] !== strict[o]) return;

        cb(e);
    });
}

function $remEvent(element, event) {
    element.removeEventListener(event, element.fn);
    element.fn = null;
}

async function wait(time, obj) {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(obj), time);
    });
}

function addNewRow() {
    let last = this.target.parentElement;
    let newRow = scetchInsert(last, "beforeBegin", scetch.newHost);
    setRowActions(newRow, true, false, true, false);
    resize();
}

function submit(row) {
    Promise.resolve().then(() => {
        setRowActions(row, false, false, false, true);

        let host = row.querySelector(".hostname").value.trim();
        let address = row.querySelector(".address").value.trim();
        if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty!");
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
        let {
            status,
            updated
        } = json;

        if (!(status === 0 && updated === 1)) throw (json.message || "Unable to update host...");
    }).then(() => { // good response
        return Promise.resolve()
            .then(() => setRowActions(row, false, true, false, false))
            .then(() => row.style["background-color"] = greenRowColor)
            .then(() => {
                Promise.resolve()
                    .then(() => wait(1000))
                    .then(() => {
                        setTransition(row, {
                            "background-color": null,
                            speed: 1500
                        });
                    });

                $addEvent(row, "transitionend", {
                    propertyName: "background-color",
                    target: row
                }, () => {
                    row.style.transition = null;
                    $remEvent(row, "transitionend");
                });
            });
    }).catch(e => {
        createError(row, e);
        setRowActions(row, true, false, true, false);
    });
}

function deleteRow(row) {
    Promise.resolve().then(() => {
            setRowActions(row, false, false, false, true);

            let host = row.children[0].value.trim();
            let address = row.children[1].value.trim();
            if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty!");
            return {
                host: host,
                address: address
            };
        }).then(h => {
            return fetch("/api/hosts", {
                method: "DELETE",
                body: JSON.stringify(h)
            });
        }).then(res => res.json()).then(json => {
            let {
                status,
                updated
            } = json;

            if (!(status === 0 && updated >= 1)) throw (json.message || "Unable to update host...");
        })
        .then(() => setRowActions(row, false, false, false, false))
        .then(() => row.style["background-color"] = redRowColor)
        .then(() => fadeout(row))
        .then(() => shrink(row))
        .then(() => row.remove())
        .catch(e => {
            createError(row, e);
        });
}

function cancelRow(row) {
    Promise.resolve()
        .then(() => setRowActions(row, false, false, false, false))
        .then(() => row.style["background-color"] = redRowColor)
        .then(() => fadeout(row))
        .then(() => shrink(row))
        .then(() => row.remove());
}

function setRowActions(row, tick, del, cancel, spinner) {
    row.querySelector("img.tick").hidden = !tick;
    row.querySelector("img.delete").hidden = !del;
    row.querySelector("img.cancel").hidden = !cancel;
    row.querySelector("img.spinner").hidden = !spinner;
}

function setTransition(row, targets) {
    targets = Object.assign({
        speed: 1000,
        fn: "linear"
    }, targets);

    let transition = [];
    for (let t in targets) {
        if (!["speed", "fn"].includes(t)) {
            transition.push(`${t} ${targets.speed}ms ${targets.fn}`);
            row.style[t] = targets[t];
        }
    }
    row.style.transition = transition.join(", ");
}

async function fadeout(row) {
    return new Promise((resolve, _) => {
        setTransition(row, {
            opacity: 0,
            speed: 700
        });

        $addEvent(row, "transitionend", {
            propertyName: "opacity",
            target: row
        }, () => {
            $remEvent(row, "transitionend");
            resolve(row);
        });
    });
}

async function shrink(row) {
    return new Promise((resolve, _) => {
        setTransition(row, {
            height: "0px",
            padding: "0px",
            margin: "-0.5rem",
            fn: "ease",
            speed: 100
        });

        $addEvent(row, "transitionend", {
            target: row
        }, (e) => {
            console.log(e);
            $remEvent(row, "transitionend");
            row.style.transition = "";
            resolve(row);
        });
    });
}

async function createError(row, err) {
    console.error(err);
    if (typeof row !== "undefined") {
        Promise.resolve()
            .then(() => {
                scetchInsert(row, "afterend", scetch.error, {
                    message: err && err.message || err || "Something went wrong..."
                });
                return row.nextElementSibling;
            })
            .then((eBox) => wait(7000, eBox))
            .then(eBox => fadeout(eBox))
            .then(eBox => shrink(eBox))
            .then(eBox => eBox.remove());
    }
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
    document.onclick = (event) => {
        let target = event.target;

        if (target.matches(".btn[action]")) {
            let a = target.getAttribute("action");
            if (actions && actions[a]) actions[a].apply(event);
        } else if (target.matches(".delete")) {
            deleteRow(target.parentElement.parentElement);
        } else if (target.matches(".tick")) {
            submit(target.parentElement.parentElement);
        } else if (target.matches(".cancel")) {
            cancelRow(target.parentElement.parentElement);
        }
    };

    window.onresize = resize;
}

(ready)();
(resize)();