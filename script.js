let map = L.map('map').setView([0, 0], 2); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

async function getIPDetails() {
    const ipAddress = document.getElementById('ipInput').value.trim();

    // Validasi: Jika input kosong, jangan lakukan apa-apa
    if (ipAddress === "") {
        alert("Silakan masukkan alamat IP terlebih dahulu.");
        return;
    }

    const url = `https://ipapi.co/${ipAddress}/json/`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error || data.reserved) {
            alert("IP tidak valid, privat, atau tidak ditemukan.");
            return;
        }

        // Tampilkan Data
        document.getElementById('ipDisplay').innerText = data.ip;
        document.getElementById('locationDisplay').innerText = `${data.city}, ${data.region}, ${data.country_name}`;
        document.getElementById('ispDisplay').innerText = data.org;
        document.getElementById('timezoneDisplay').innerText = data.timezone;

        // Update Peta
        const lat = data.latitude;
        const lon = data.longitude;
        map.setView([lat, lon], 13);

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`Lokasi IP: ${data.city}`)
            .openPopup();

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat mengambil data.");
    }
}

// Bagian window.onload DIHAPUS agar tidak melacak otomatis saat buka web