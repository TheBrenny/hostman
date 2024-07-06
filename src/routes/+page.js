import {version} from '$app/environment';

/** @type {import('./$types').PageLoad} */
export async function load({params, fetch}) {
    return {
        version,
        hosts: await (await fetch("/api/hosts")).json(),
    };
};