// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // আপনার Supabase URL দিন
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // আপনার Supabase Key দিন
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('verificationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cdcNo = document.getElementById('certificateNo').value.trim();
    const dob = document.getElementById('dateOfBirth').value;
    const resultBox = document.getElementById('resultBox');

    // Loading state
    resultBox.style.display = 'block';
    resultBox.className = 'result-box';
    resultBox.innerHTML = '<p style="text-align: center; color: #666;">Searching records...</p>';

    try {
        // Query database table (assuming table name is 'seafarers')
        const { data, error } = await supabase
            .from('seafarers')
            .select('*')
            .eq('cdc_number', cdcNo)
            .eq('date_of_birth', dob)
            .single();

        if (error || !data) {
            resultBox.className = 'result-box result-error';
            resultBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> No record found with the provided details.';
            return;
        }

        // Generate Table Layout matching the GSO interface
        resultBox.className = 'result-box result-success-container';
        resultBox.innerHTML = `
            <div class="result-header">
                <i class="fa-regular fa-circle-down"></i> CDC VERIFICATION RESULT
            </div>
            <div class="table-responsive">
                <table class="gso-result-table">
                    <thead>
                        <tr>
                            <th>SERIAL NO</th>
                            <th>NAME</th>
                            <th>DATE OF BIRTH</th>
                            <th>CDC NUMBER <i class="fa-solid fa-arrow-down-short-wide"></i></th>
                            <th>DATE OF ISSUE</th>
                            <th>DATE OF EXPIRE</th>
                            <th>PLACE OF ISSUE</th>
                            <th>DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="bold-text">${data.name || 'N/A'}</td>
                            <td>${formatDate(data.date_of_birth)}</td>
                            <td class="bold-text">${data.cdc_number || cdcNo}</td>
                            <td>${data.date_of_issue || 'N/A'}</td>
                            <td>${data.date_of_expire || 'N/A'}</td>
                            <td>${data.place_of_issue || 'CHATTOGRAM'}</td>
                            <td>
                                <button class="btn-details" onclick="viewDetails('${data.cdc_number}')">
                                    <i class="fa-solid fa-eye"></i> Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

    } catch (err) {
        resultBox.className = 'result-box result-error';
        resultBox.innerHTML = 'An unexpected error occurred. Please try again.';
    }
});

// Helper function to format Date of Birth as DD-MM-YYYY
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function viewDetails(cdcNumber) {
    alert('Viewing details for CDC: ' + cdcNumber);
}
