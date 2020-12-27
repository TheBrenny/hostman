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

function $addEvent(element, event, strictTarget, cb) {
    if (typeof cb === "undefined") {
        cb = strictTarget;
        strictTarget = {};
    }
    strictTarget = strictTarget || {};
    element.customEvents = element.customEvents || {};
    element.addEventListener(event, element.customEvents[event] = (e) => {
        for (let o in strictTarget)
            if (e[o] !== strictTarget[o]) return;

        cb(e);
    });
}

function $remEvent(element, event) {
    element.removeEventListener(event, element.customEvents[event]);
    delete element.customEvents[event];
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
        let hash = row.attributes.hash.value;

        if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty!");

        return {
            host: host,
            address: address,
            comment: hash
        };
    }).then(h => {
        return fetch("/api/hosts", {
            method: "POST",
            body: JSON.stringify(h)
        });
    }).then(res => res.json()).then(json => {
        let {
            status,
            updated,
            hash
        } = json;

        if (!(status === 0 && updated === 1)) throw (json.message || "Unable to update host...");
        return hash;
    }).then((hash) => { // good response
        row.setAttribute("hash", hash);

        return Promise.resolve()
            .then(() => prepareRow(row))
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
            let hash = row.attributes.hash.value;

            if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty!");

            return {
                host: host,
                address: address,
                comment: hash
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
        .then(async () => {
            if (row.attributes.hash.value === "") {
                setRowActions(row, false, false, false, false);
                row.style["background-color"] = redRowColor;
                await fadeout(row);
                await shrink(row);
                row.remove();
            } else {
                setRowActions(row, false, true, false, false);
                row.querySelectorAll("input").forEach(i => {
                    if (i.backupVal != null) i.value = i.backupVal;
                    i.backupVal = null;
                });
            }
        });
}

function setRowActions(row, tick, del, cancel, spinner) {
    row.querySelector("img.tick").hidden = !tick;
    row.querySelector("img.delete").hidden = !del;
    row.querySelector("img.cancel").hidden = !cancel;
    row.querySelector("img.spinner").hidden = !spinner;
}

function setTransition(row, attribs) {
    attribs = Object.assign({
        speed: 1000,
        fn: "linear"
    }, attribs);

    let transition = [];
    for (let t in attribs) {
        if (!["speed", "fn"].includes(t)) {
            transition.push(`${t} ${attribs.speed}ms ${attribs.fn}`);
            row.style[t] = attribs[t];
        }
    }
    row.style.transition = transition.join(", ");
}

function prepareRow(row) {
    row.querySelectorAll("input").forEach(i => {
        $addEvent(i, "beforeinput", () => {
            if (i.backupVal == null) i.backupVal = i.value;
            setRowActions(row, true, false, true, false);
        });
    });
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
    let main = $(".main");

    if (main.clientWidth <= 728) {
        if (!main.classList.contains("overflowing")) main.classList.add("overflowing");
    } else {
        main.classList.remove("overflowing");
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

    $$(".row.host").forEach(prepareRow);

    window.onresize = resize;
}

(ready)();
(resize)();