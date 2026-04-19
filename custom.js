(function () {
    let latestData = null;

    // Capture Skyline's raw data (includes decimal DPS)
    document.addEventListener("onOverlayDataUpdate", (e) => {
        latestData = e.detail;
    });

    function updateBars() {
        const rows = document.querySelectorAll('.combatant');
        if (!rows.length || !latestData) return;

        // Format total party DPS (encounter DPS) with thousand separators, no decimals
        const encounterNode = document.querySelector('.encounter-content-numbers .g-number');
        if (encounterNode && latestData.Encounter) {
            const raw = Number(latestData.Encounter.DPS);
            if (!isNaN(raw)) {
                encounterNode.textContent = raw.toLocaleString("en-US");
            }
        }

        // Remove previous top-dps class
        rows.forEach(r => r.classList.remove('top-dps'));

        // Collect DPS values from Skyline data
        const dpsValues = [];
        const combatants = latestData.Combatant || [];

        rows.forEach(row => {
            const nameNode = row.querySelector('.combatant-name');
            if (!nameNode) return;

            const name = nameNode.textContent.trim();
            const c = combatants.find(x => x.name === name);
            if (!c) return;

            const dps = Number(c.DPS);
            if (!isNaN(dps)) dpsValues.push(dps);
        });

        if (!dpsValues.length) return;

        const totalDPS = dpsValues.reduce((a, b) => a + b, 0);
        const topDPS = Math.max(...dpsValues);

        // Update each row
        rows.forEach(row => {
            const nameNode = row.querySelector('.combatant-name');
            const dpsNode = row.querySelector('.combatant-content-data .g-number');
            const bar = row.querySelector('.combatant-content');
            if (!nameNode || !dpsNode || !bar) return;

            const name = nameNode.textContent.trim();
            const c = combatants.find(x => x.name === name);
            if (!c) return;

            const dps = Number(c.DPS);
            if (isNaN(dps)) return;

            // Format player DPS with thousand separators and exactly 1 decimal
            dpsNode.textContent = dps.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });

            // Scale bar
            const pctOfTop = Math.min(dps / topDPS, 1);
            bar.style.setProperty('--bar-width', `${pctOfTop * 120}px`);

            // Mark top DPS
            if (dps === topDPS) {
                row.classList.add('top-dps');
            }

            // Percent of total DPS
            const pct = totalDPS > 0 ? ((dps / totalDPS) * 100).toFixed(0) : "0";

            // Insert or update the % span
            let pctSpan = bar.querySelector('.pct');
            if (!pctSpan) {
                pctSpan = document.createElement('span');
                pctSpan.className = 'pct';
                bar.prepend(pctSpan);
            }
            pctSpan.textContent = pct + "%";
        });
    }

    setInterval(updateBars, 60);
})();
