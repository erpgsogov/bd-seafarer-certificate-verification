// পেজ লোড হওয়ার সাথে সাথে লিংক চেক করবে
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const certParam = urlParams.get('certNo');
    const dobParam = urlParams.get('dob');

    // যদি লিংকের মধ্যে তথ্য থাকে, তবে ইনপুট বক্সে বসাবে এবং অটো ভেরিফাই করবে
    if (certParam && dobParam) {
        document.getElementById('certificateNo').value = certParam;
        document.getElementById('dateOfBirth').value = dobParam;
        verifyCertificate(certParam, dobParam);
    }
});

// ফর্ম সাবমিট হ্যান্ডলার
document.getElementById('verificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const certNo = document.getElementById('certificateNo').value.trim();
    const dob = document.getElementById('dateOfBirth').value;
    verifyCertificate(certNo, dob);
});

// ভেরিফিকেশন লজিক ফাংশন
function verifyCertificate(certNo, dob) {
    const resultBox = document.getElementById('resultBox');
    
    if (certNo === 'C/O/6628' && dob === '1990-04-05') {
        resultBox.style.display = 'block';
        resultBox.className = 'result-box result-success';
        resultBox.innerHTML = '<strong>SUCCESS:</strong> Certificate is Valid!<br>Name: MD KHALILUR RAHMAN<br>Rank: Chief Officer';
    } else {
        resultBox.style.display = 'block';
        resultBox.className = 'result-box result-error';
        resultBox.innerHTML = '<strong>ERROR:</strong> Certificate not found or Invalid details.';
    }
}
