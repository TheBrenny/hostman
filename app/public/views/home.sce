[[i= partials/head ]]

<div class="wrapper">
    <div class="main">
        <div class="row max">
            <div class="headerSupport"></div>
            <div class="headerMain">
                <h1>hostman</h1>
                <div class="br"></div>
                <p id="versionNumber">(v[[version]])</p>
            </div>
            <div class="headerSupport">
                <img class="settings btn" src="/assets/img/gear.svg" alt="settings" action="settings">
            </div>
        </div>
        [[e= host in hosts ]]
        [[c= components/validHost || hash=host.comment host=host.host address=host.address ]]
        [[?==]]
        <div class="row newHost">
            <div class="btn" action="newHost">add new host</div>
        </div>
    </div>
</div>
[[i= partials/settingsPanel ]]

<script src="assets/js/main.js"></script>
[[l= components/newHost ]]
[[l= components/validHost ]]
[[l= components/error ]]

[[i= partials/foot ]]