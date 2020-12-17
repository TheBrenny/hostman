[[i= partials/head ]]

<div class="main">
    <div class="row max">
        <h1>hostman</h1>
        <div class="br"></div>
        <p id="versionNumber">(v[[version]])</p>
    </div>
    [[e= host in hosts ]]
        [[c= components/validHost || hash=host.comment host=host.host address=host.address ]]
    [[?==]]
    <div class="row newHost">
        <div class="btn" action="newHost">add new host</div>
    </div>
</div>

<script src="assets/js/main.js"></script>
[[l= components/newHost ]]
[[l= components/validHost ]]
[[l= components/error ]]

[[i= partials/foot ]]