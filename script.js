document.getElementById('verificationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const certNo = document.getElementById('certificateNo').value;
    const dob = document.getElementById('dateOfBirth').value;
    const resultBox = document.getElementById('resultBox');

    // আপডেট করা ডেটাবেজ তথ্য
    if (certNo === 'C/O/6628' && dob === '1990-05-04') {
        resultBox.style.display = 'block';
        resultBox.className = 'result-box result-success';
        resultBox.innerHTML = '<strong>SUCCESS:</strong> Certificate is Valid!<br>Name: MD KHALILUR RAHMAN<br>Rank: Chief Officer';
    } else {
        resultBox.style.display = 'block';
        resultBox.className = 'result-box result-error';
        resultBox.innerHTML = '<strong>ERROR:</strong> Certificate not found or Invalid details.';
    }
});
