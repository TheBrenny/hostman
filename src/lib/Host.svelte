<script>
    import { createEventDispatcher } from "svelte";
    import { HOST_STATES } from "./utils";

    export let hash = "";
    export let host = "";
    export let address = "";
    let backups = {
        hash: hash + "",
        host: host + "",
        address: address + "",
    };
    export let state = HOST_STATES.SAVED;

    /** @type {{hash:HTMLInputElement|null, host:HTMLInputElement|null, address:HTMLInputElement|null}} */
    let inputs = { hash: null, host: null, address: null };

    let dispatch = createEventDispatcher();
    /** @type {AbortController} */
    let fetchAbortController = new AbortController();

    const actions = {
        save: async () => {
            try {
                state = HOST_STATES.WAITING;
                toggleInputs(false);

                host = host.trim();
                address = address.trim();

                console.log(host, address, "saving");

                if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty!");

                fetchAbortController = new AbortController();
                let res = await (await fetch("/api/hosts", { signal: fetchAbortController.signal, method: "POST", body: JSON.stringify({ host, hash, address }) })).json();
                let status = res.status;
                let updated = res.updated;
                if (!(status === 0 && updated === 1)) throw new Error(res.message || "Unable to update host...");
                hash = res.hash;

                backups = {
                    hash: hash + "",
                    host: host + "",
                    address: address + "",
                };

                state = HOST_STATES.SAVED;
                toggleInputs(true);

                dispatch("saved", { hash, host, address });
            } catch (error) {
                dispatch("error", { hash, error });
                state = HOST_STATES.DRAFT;
                toggleInputs(true);
            }
        },
        cancel: async () => {
            if (hash === "") {
                // new host
                if (!!fetchAbortController) fetchAbortController.abort();
                toggleInputs(true);
                dispatch("cancel", { hash });
            } else {
                // existing host
                toggleInputs(true);
                state = HOST_STATES.SAVED;
                host = backups.host + "";
                hash = backups.hash + "";
                address = backups.address + "";
                dispatch("cancel", { hash });
            }
        },
        remove: async () => {
            try {
                state = HOST_STATES.WAITING;
                toggleInputs(false);

                if (host.length === 0 || address.length === 0) throw new Error("Host and address cannot be empty! Wait, how did you get here?!");

                let res = await (await fetch("/api/hosts", { method: "DELETE", body: JSON.stringify({ host, hash, address }) })).json();
                let status = res.status;
                let updated = res.updated;

                if (!(status === 0 && updated === 1)) throw new Error(res.message || "Unable to remove host...");

                state = HOST_STATES.SAVED;
                dispatch("removed", { hash });
            } catch (error) {
                dispatch("error", { hash, error });
                state = HOST_STATES.SAVED;
                toggleInputs(true);
            }
        },
    };

    $: if (host !== backups.host || address !== backups.address) {
        state = HOST_STATES.DRAFT;
    }

    function toggleInputs(enabled) {
        Object.values(inputs).forEach((input) => input !== null && (input.disabled = !enabled));
    }
</script>

<input type="hidden" class="hash" bind:value={hash} bind:this={inputs.hash} />
<input placeholder="hostname" type="text" class="hostname" bind:value={host} bind:this={inputs.host} />
<input placeholder="address" type="text" class="address" bind:value={address} bind:this={inputs.address} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="actions">
    {#if state === HOST_STATES.DRAFT}
        <img class="tick hostAction" on:click={actions.save} alt="Submit" />
        <img class="cancel hostAction" on:click={actions.cancel} alt="Cancel" />
    {:else if state === HOST_STATES.WAITING}
        <img class="cancel hostAction" on:click={actions.cancel} alt="Cancel" />
        <img class="spinner hostAction" alt="Waiting" />
    {:else}
        <img class="remove hostAction" on:click={actions.remove} alt="Remove" />
    {/if}
</div>

<style>
    input.hostname,
    input.address {
        border-radius: 0.6rem;
        padding: 1rem 1.2rem 1rem 0.2rem !important;
        font-size: 1.3rem;
        border: none;
        display: block;
        box-sizing: border-box;
        transition: border 0.2s;
        background: var(--block-color);
        border-bottom: 0.1rem solid transparent;

        &:hover,
        &:focus {
            border-bottom: 0.1rem solid var(--border-color);
            outline: none;
        }
    }

    input.address {
        flex-grow: 2;
    }

    .actions {
        display: inline-flex;
        flex-flow: column;
        justify-content: center;
        gap: 0.5rem;
    }

    img {
        &.cross {
            content: url("$lib/assets/cross.svg");
            width: 2rem;
            height: 2rem;
        }

        &.hostAction {
            width: 1.1rem;
            height: 1.1rem;
            opacity: 0.4;
            transition: opacity 0.2s ease-out;

            &.tick {
                content: url("$lib/assets/tick.svg");
                cursor: pointer;
            }

            &.delete,
            &.cancel,
            &.remove {
                content: url("$lib/assets/cross.svg");
                cursor: pointer;
            }

            &.spinner {
                opacity: 1;
                animation: spinner 1s linear infinite;
                content: url("$lib/assets/spinner.svg") !important;
            }

            &:hover {
                opacity: 1;
            }
        }
    }

    @keyframes -global-spinner {
        0% {
            transform: rotate(0deg);
        }

        50% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>
