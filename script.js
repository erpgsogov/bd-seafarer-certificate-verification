document.getElementById('verificationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const cdcNo = document.getElementById('certificateNo').value.trim();
    const dob = document.getElementById('dateOfBirth').value;
    const resultBox = document.getElementById('resultBox');

    // রেজাল্ট বক্স দেখানো
    resultBox.style.display = 'block';

    if (!cdcNo || !dob) {
        resultBox.innerHTML = '<p style="color:red; font-size:13px;">Please enter CDC Number and Date of Birth.</p>';
        return;
    }

    // টেবিল লেআউট জেনারেট
    resultBox.innerHTML = `
        <div class="result-header" style="margin-top:20px; font-weight:bold; color:#2b7bb9;">
            <i class="fa-regular fa-circle-down"></i> CDC VERIFICATION RESULT
        </div>
        <div class="table-responsive" style="overflow-x:auto; margin-top:10px;">
            <table class="gso-result-table">
                <thead>
                    <tr>
                        <th>SERIAL NO</th>
                        <th>NAME</th>
                        <th>DATE OF BIRTH</th>
                        <th>CDC NUMBER</th>
                        <th>DATE OF ISSUE</th>
                        <th>DATE OF EXPIRE</th>
                        <th>PLACE OF ISSUE</th>
                        <th>DETAILS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td style="font-weight:bold;">MD MONERUL ISLAM</td>
                        <td>${formatDate(dob)}</td>
                        <td style="font-weight:bold;">${cdcNo}</td>
                        <td>23 Aug 2021</td>
                        <td>22 Aug 2031</td>
                        <td>CHATTOGRAM</td>
                        <td>
                            <button class="btn-details" onclick="alert('Viewing Details for ${cdcNo}')">
                                <i class="fa-solid fa-eye"></i> Details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
});

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}
