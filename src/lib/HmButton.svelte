<script>
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button on:click on:mouseover on:mouseenter on:mouseleave {...$$restProps}>
    <slot />
</button>

<style>
    button {
        background: var(--btnColor);
        padding: 1rem;
        border-radius: 0.6rem;
        cursor: pointer;
        transition: 0.2s ease-out;
        user-select: none;
        border: none;
        outline: #00000000 solid 2px;

        &:hover {
            filter: brightness(85%);
        }

        &:active {
            filter: brightness(75%);
        }

        &:focus-visible {
            outline: var(--borderColor) solid 2px;
        }
    }
</style>
