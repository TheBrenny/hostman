<script>
    import HmButton from "./HmButton.svelte";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let settingsWrap;

    onMount(() => {
        document.addEventListener("keydown", (e) => (e.key === "Escape" && tryClose()) || console.log(e.key));
    });

    function tryClose() {
        document.removeEventListener("keydown", tryClose);
        dispatch("close");
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={settingsWrap} class="settingsWrap" on:click={(event) => event.target === settingsWrap && tryClose()}>
    <div class="panel">
        <h2>Settings</h2>
        <div class="zone">
            <h4>Dark Mode</h4>
            <HmButton on:click={() => dispatch("themeChange")} style="height:1.5em;width:1.5em;padding:0px;font-size:2rem;overflow:hidden;">
                <div class="flipper">
                    <div class="icon">🌞</div>
                    <div class="icon" style="rotate:180deg;">🌚</div>
                </div>
            </HmButton>
        </div>
        <div class="zone">
            <!-- TODO: https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#get-a-gist -->
            <h4>Sync <em>(coming soon!)</em></h4>
            <div class="syncZone">
                <input disabled type="text" placeholder="Gist link" style="font-size:0.8em;padding: 0.5rem 0.2rem;align-self:stretch;font-style:italic;" />
                <HmButton style="font-size:1.3em;padding:0.4rem;">🔄️</HmButton>
            </div>
        </div>
        <div class="zone">
            <h4>Thanks!</h4>
            <div class="creditZone">
                <span style="text-align:right">
                    <a href="https://github.com/thebrenny">thebrenny</a>
                </span>
                <span style="text-align:center"> / </span>
                <span style="text-align:left">
                    <a href="https://github.com/thebrenny/hostman">hostman</a>
                </span>
            </div>
        </div>
        <HmButton on:click={tryClose}>Close</HmButton>
    </div>
</div>

<style>
    .settingsWrap {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #22222288;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .panel {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        width: 35%;
        background: var(--baseColor);
        padding: 2em;
        border-radius: 1em;
        box-shadow: var(--shadowColor) 0 0 10px 10px;
    }

    .zone {
        display: flex;
        flex-flow: column;
        gap: 0.5em;
        align-items: center;
        width: 100%;

        & > h4 {
            margin: 0;
        }
    }

    .syncZone {
        display: flex;
        flex-flow: row;
        width: 100%;
        gap: 0.5em;

        & > input {
            flex-grow: 1;
        }
    }

    .creditZone {
        display: grid;
        grid-template-columns: 1fr 0.2fr 1fr;
        gap: 0.5em;
    }

    .flipper {
        rotate: 0deg;
        transition: rotate 0.2s;
    }

    :global(body.dark) .flipper {
        rotate: -180deg;
    }
</style>
