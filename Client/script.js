document.addEventListener('DOMContentLoaded', () => {
  // Change this when deployed
  const BASE_URL = 'http://127.0.0.1:5000';

  const form = document.getElementById('predictionForm');
  const btn = document.getElementById('predictButton');
  const btnText = document.getElementById('buttonText');
  const btnSpinner = document.getElementById('buttonSpinner');
  const resultDiv = document.getElementById('predictionResult');
  const metaHint = document.getElementById('metaHint');

  const locationSelect = document.getElementById('location_select');

  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  let loaded = false;

  // Dark mode toggle
  const applyTheme = (mode) => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.body.classList.toggle('bg-gray-950', mode === 'dark');
    document.body.classList.toggle('text-gray-100', mode === 'dark');
    themeLabel.textContent = mode === 'dark' ? 'Light' : 'Dark';
  };
  const savedTheme = sessionStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    sessionStorage.setItem('theme', next);
    applyTheme(next);
  });

  const setLoading = (isLoading) => {
    btn.disabled = isLoading || !loaded;
    btnText.textContent = isLoading ? 'Predicting…' : 'Predict Price';
    btnSpinner.classList.toggle('hidden', !isLoading);
  };

  const normalizeForLabel = (raw) => {
    const stripped = String(raw).replace(/^location_ */i, '').replace(/\s+/g, ' ').trim();
    return stripped.replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const loadLocations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_location_names`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.locations && Array.isArray(data.locations)) ? data.locations : [];
      if (!arr.length) throw new Error('No locations received');

      // Populate select with value=raw key, label=prettified
      locationSelect.innerHTML = '<option value="">-- Select a Location --</option>';
      arr.forEach((raw) => {
        const opt = document.createElement('option');
        opt.value = String(raw);              // exact backend key
        opt.textContent = normalizeForLabel(raw); // human-readable label
        locationSelect.appendChild(opt);
      });

      locationSelect.disabled = false;
      loaded = true;
      btn.disabled = false;
      metaHint.textContent = `${arr.length} locations loaded`;
    } catch (err) {
      loaded = false;
      btn.disabled = true;
      locationSelect.disabled = true;
      metaHint.textContent = 'Failed to load locations. Check backend URL.';
      console.error(err);
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!loaded) return;

    const sqft = parseFloat(document.getElementById('total_sqft').value);
    const bhk = parseInt(document.getElementById('bhk').value, 10);
    const bath = parseInt(document.getElementById('bath').value, 10);
    const locationKey = locationSelect.value;

    // Basic validation
    if (!Number.isFinite(sqft) || sqft < 100) {
      showError('Please enter a valid square feet value (≥ 100).');
      return;
    }
    if (!Number.isInteger(bhk) || bhk < 1 || bhk > 10) {
      showError('Please enter a valid BHK between 1 and 10.');
      return;
    }
    if (!Number.isInteger(bath) || bath < 1 || bath > 10) {
      showError('Please enter bathrooms between 1 and 10.');
      return;
    }
    if (!locationKey) {
      showError('Please select a location.');
      return;
    }

    setLoading(true);
    resultDiv.innerHTML = '';

    try {
      const res = await fetch(`${BASE_URL}/predict_home_price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_sqft: sqft,
          location: locationKey, // exact key as required by the model
          bhk,
          bath
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (typeof json.estimated_price !== 'number') throw new Error('Invalid response format.');
      showResult(json.estimated_price);
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  });

  const showResult = (priceLakhs) => {
    const formatted = priceLakhs.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    resultDiv.innerHTML = `
      <div class="text-center">
        <h3 class="text-base font-medium text-gray-700">Estimated Price</h3>
        <p class="mt-2 text-4xl font-extrabold text-indigo-600">₹ ${formatted} Lakhs</p>
        <p class="mt-1 text-xs text-gray-500">Model output; actual market price may vary.</p>
      </div>
    `;
  };

  const showError = (msg) => {
    resultDiv.innerHTML = `
      <div class="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
        <span class="font-semibold">Error:</span> ${msg}
      </div>
    `;
  };

  loadLocations();
});

