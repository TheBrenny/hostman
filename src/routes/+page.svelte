<script>
    import HmButton from "$lib/HmButton.svelte";
    import Host from "$lib/Host.svelte";
    import SettingsPanel from "$lib/SettingsPanel.svelte";
    import gearSvg from "$lib/assets/gear.svg";
    import { addEvent, clearTransitionPropWhenDone, dqs, did, HOST_STATES, setTransition, wait, colorRow } from "$lib/utils";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    export let version = data.version;

    /** @type {{host:string,hash:string,address:string,state?:string}[]} */
    export let hosts = data.hosts || [];

    let makingNewHost = false;
    let showSettings = false;

    function newHost() {
        makingNewHost = true;
        requestAnimationFrame(() => innerBox?.scrollTo({ behavior: "smooth", top: innerBox.scrollHeight }));
    }

    /** @type {HTMLElement|undefined}*/
    let innerBox;

    onMount(() => {
        (window.onresize = resize)();

        let darkMode = (localStorage.getItem("darkmode") ?? "false") === "true";
        document.body.classList.toggle("dark", darkMode);
    });

    function resize() {
        if (!innerBox) return;
        innerBox.classList.toggle("overflowing", innerBox.clientWidth <= 728);
    }

    const actions = {
        new: {
            saved: async (event) => {
                let host = event.detail;

                // add host first so we can colour it correctly
                hosts = [...hosts, host];
                // request animation frame so `hosts` can actaully update
                requestAnimationFrame(() => {
                    // flash box as green
                    colorRow(did(host.hash), "green");
                    makingNewHost = false;
                });
            },
            cancel: async (event) => {
                let hash = event.detail.hash;
                // flash box as red
                await colorRow(did("newHost"), "red");
                makingNewHost = false;
            },
            error: async (event) => {
                let hash = event.detail.hash;
                // flash box as red
                colorRow(did("newHost"), "red");
            },
        },
        cur: {
            saved: async (event) => {
                let hash = event.detail.hash;
                // flash box as green
                colorRow(did(hash), "green");
            },
            removed: async (event) => {
                let hash = event.detail.hash;
                // flash box as red
                let row = did(hash);
                if (!!row) {
                    await colorRow(row, "green");
                    row.remove();
                }
            },
            cancel: async (event) => {
                let hash = event.detail.hash;
                // flash box as red
                colorRow(did(hash), "red");
            },
            error: async (event) => {
                let hash = event.detail.hash;
                // flash box as red
                colorRow(did(hash), "red");
            },
        },
        settings: async (event) => {
            showSettings = !showSettings;
        },
        switchTheme: async () => {
            let darkMode = document.body.classList.contains("dark");
            document.body.classList.toggle("dark", !darkMode);
            localStorage.setItem("darkmode", (!darkMode).toString());
        },
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper">
    <div class="row header">
        <div class="block spacer"></div>
        <div class="block mainHead">
            <h1>hostman</h1>
            <div class="br"></div>
            <p id="versionNumber">(v{version})</p>
        </div>
        <div class="block settingsBox">
            <HmButton style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;" on:click={actions.settings}>
                <img style="width: 35px" class="settings btn" src={gearSvg} alt="settings" />
            </HmButton>
        </div>
    </div>
    <div class="container">
        <div class="innerBox" bind:this={innerBox}>
            {#each hosts as host}
                <div id={host.hash} class="row host">
                    <Host host={host.host} hash={host.hash} address={host.address} state={host.state} on:cancel={actions.cur.cancel} on:error={actions.cur.error} on:saved={actions.cur.saved} on:removed={actions.cur.removed} />
                </div>
            {/each}

            {#if makingNewHost}
                <div id="newHost" class="row host">
                    <Host state={HOST_STATES.DRAFT} on:cancel={actions.new.cancel} on:error={actions.new.error} on:saved={actions.new.saved} />
                </div>
            {/if}
        </div>
    </div>
    <div class="row newHost">
        <HmButton on:click={newHost} style="flex-grow: 0.25;">add new host</HmButton>
    </div>
</div>
{#if showSettings}
    <SettingsPanel on:close={actions.settings} on:themeChange={actions.switchTheme} />
{/if}

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

    .wrapper {
        display: flex;
        flex-flow: column;
        gap: 1em;
        justify-content: center;
        align-items: center;
        width: 70%;
        height: 90%;

        & > * {
            width: 80%;
        }
    }

    .innerBox,
    .row {
        padding: 1rem;
        display: flex;
    }

    .container {
        width: 80%;
        height: 80%;
        overflow-x: hidden;
        overflow-y: hidden;
        background-color: var(--blockColor);
        box-shadow: inset 0 0 0.3rem 0.3rem var(--shadowColor);
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
            background-color: var(--shadowColor);
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
        background-color: var(--blockColor);
        justify-content: space-between;
        gap: 0.75rem;
        flex-flow: row wrap;

        &.header {
            align-items: center;

            & > .block {
                flex-grow: 1;
                flex-basis: 0;

                &.settingsBox {
                    display: flex;
                    justify-content: end;
                }
            }
        }
        &.newHost {
            justify-content: center;
        }
    }
</style>
