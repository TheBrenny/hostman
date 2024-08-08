export const HOST_STATES = {
    DRAFT: "draft",
    WAITING: "waiting",
    SAVED: "saved",
};

/**
 * @param {number} time Time in millis to await
 * @param {*} obj Object to resolve with
 */
export async function wait(time, obj = undefined) {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(obj), time);
    });
}

export const dqs = (s) => document.querySelector(s);
export const did = (s) => document.getElementById(s);

export async function colorRow(row, color) {
    if(row) {
        row.style["background-color"] = `var(--${color}Row)`;
        await wait(1000);
        setTransition(row, {
            "background-color": null,
            speed: 1500,
        });
        await clearTransitionPropWhenDone(row, "background-color");
    }
}

/**
 * @param {HTMLElement} row
 * @param {Object<string,any>} attribs
 */
export function setTransition(row, attribs) {
    attribs = Object.assign({
        speed: 1000,
        fn: "linear"
    }, attribs);

    let transition = [];
    for(let t in attribs) {
        if(!["speed", "fn"].includes(t)) {
            transition.push(`${t} ${attribs.speed}ms ${attribs.fn}`);
            row.style[t] = attribs[t];
        }
    }
    row.style.transition = transition.join(", ");
}

/**
 * @param {HTMLElement} element
 * @param {string} prop
 */
export async function clearTransitionPropWhenDone(element, prop, cb = () => {}) {
    return new Promise((resolve, _) => {
        addEvent(element, "transitionend", {
            propertyName: "background-color",
            target: element,
        }, () => {
            // @ts-ignore
            element.style.transition = null;
            remEvent(element, "transitionend");
            resolve(cb());
        })
    });
}
export function addEvent(element, event, strictTarget, cb) {
    if(typeof cb === "undefined") {
        cb = strictTarget;
        strictTarget = {};
    }
    strictTarget = strictTarget || {};
    element.customEvents = element.customEvents || {};
    element.addEventListener(event, element.customEvents[event] = (e) => {
        for(let o in strictTarget)
            if(e[o] !== strictTarget[o]) return;

        cb(e);
    });
}

export function remEvent(element, event) {
    element.removeEventListener(event, element.customEvents[event]);
    delete element.customEvents[event];
}

