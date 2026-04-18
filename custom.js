(function () {
    function updateBars() {
        const rows = document.querySelectorAll('.combatant');
        if (!rows.length) return;

        // Remove previous top-dps class
        rows.forEach(r => r.classList.remove('top-dps'));

        // Collect DPS values
        const dpsValues = [];
        rows.forEach(row => {
            const dpsNode = row.querySelector('.combatant-content-data .g-number');
            if (!dpsNode) return;
            const dps = Number(dpsNode.textContent.replace(/,/g, ''));
            if (!isNaN(dps)) dpsValues.push(dps);
        });

        if (!dpsValues.length) return;

        const totalDPS = dpsValues.reduce((a, b) => a + b, 0);
        const topDPS = Math.max(...dpsValues);

        // Update each row
        rows.forEach(row => {
            const dpsNode = row.querySelector('.combatant-content-data .g-number');
            const bar = row.querySelector('.combatant-content');
            if (!dpsNode || !bar) return;

            const dps = Number(dpsNode.textContent.replace(/,/g, ''));
            if (isNaN(dps)) return;

            // Scale bar
            const pctOfTop = Math.min(dps / topDPS, 1);
            bar.style.setProperty('--bar-width', `${pctOfTop * 120}px`);

            // Mark top DPS
            if (dps === topDPS) {
                row.classList.add('top-dps');
            }

            // Percent of total DPS
            const pct = totalDPS > 0 ? ((dps / totalDPS) * 100).toFixed(0) : "0.0";

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

