<script>
    import Host from "$lib/Host.svelte";
    import { HOST_STATES } from "$lib/utils";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    export let version = data.version;

    /** @type {{host:string,hash:string,address:string,state?:string}[]} */
    export let hosts = data.hosts || [];

    let makingNewHost = false;

    function newHost() {
        makingNewHost = true;
    }

    /** @type {HTMLElement|undefined}*/
    let innerBox;

    onMount(() => (window.onresize = resize)());

    // @ts-ignore
    function resize() {
        if (!innerBox) return;
        innerBox.classList.toggle("overflowing", innerBox.clientWidth <= 728);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
    <div class="innerBox" bind:this={innerBox}>
        <div class="row header">
            <h1>hostman</h1>
            <div class="br"></div>
            <p id="versionNumber">(v{version})</p>
        </div>

        {#each hosts as host}
            <div class="row host" id={host.hash}>
                <Host host={host.host} hash={host.hash} address={host.address} state={host.state} />
            </div>
        {/each}

        {#if makingNewHost}
            <div class="row host">
                <Host />
            </div>
        {/if}

        <div class="row newHost">
            <div class="btn" on:click={newHost}>add new host</div>
        </div>
    </div>
</div>

<style>
    h1 {
        width: 100%;
        margin: 0;
        font-size: 3em;
    }

    #versionNumber {
        flex-grow: 1;
        margin: 0;
        height: 1em;
        margin-top: -1em !important;
    }

    .innerBox,
    .row {
        padding: 1rem;
        display: flex;
    }

    .container {
        width: 60%;
        height: 80%;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: var(--block-color);
        box-shadow: inset 0 0 0.3rem 0.3rem var(--shadow-color);
        border-radius: 0.6rem;
        padding: 0em 1em;
        padding-right: 0.5em;
    }

    .innerBox {
        height: 100%;
        margin: 0;
        flex-flow: column nowrap;
        gap: 1rem;
        overflow-y: scroll;
        padding: 1em 0em;
        padding-right: 0.5em;

        &::-webkit-scrollbar {
            width: 0.5em;
            height: 0.5em;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--shadow-color);
            border-radius: 10em;
            margin: 1em;
        }

        &::-webkit-scrollbar-button {
            background: transparent;
            width: 0.5em;
            height: 0.5em;
        }

        &.overflowing {
            gap: 1.5rem;

            & .row {
                flex-direction: column;

                & .actions {
                    flex-flow: row;
                }
            }
        }
    }

    .row {
        border-radius: 0.6rem;
        margin: 0;
        background-color: var(--block-color);
        justify-content: space-between;
        gap: 0.75rem;
        flex-flow: row wrap;
    }

    .row.newHost {
        justify-content: center;

        & .btn {
            flex-grow: 0.25;
        }
    }
</style>
