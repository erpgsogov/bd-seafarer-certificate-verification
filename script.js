* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
}

body, html {
    height: 100%;
    width: 100%;
    background-color: #edf1f5;
}

.page-wrapper {
    display: flex;
    min-height: 100vh;
    width: 100%;
}

/* LEFT GREEN PANEL */
.left-panel {
    width: 50%;
    background-color: #0b8043;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0);
    background-size: 16px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    text-align: center;
    padding: 40px 20px;
}

.brand-content {
    max-width: 480px;
}

.logo-circle {
    width: 140px;
    height: 140px;
    background: #ffffff;
    border-radius: 50%;
    margin: 0 auto 25px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.logo-circle img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
}

.brand-content h1 {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
}

.brand-content p {
    font-size: 14px;
    opacity: 0.95;
    line-height: 1.4;
}

/* RIGHT PANEL */
.right-panel {
    width: 50%;
    background-color: #edf1f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px;
}

/* FORM CARD CONTAINER */
.form-card {
    background: #ffffff;
    padding: 35px 40px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 560px;
    margin: auto;
}

.form-header {
    font-size: 17px;
    font-weight: bold;
    color: #2b7bb9;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-row {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
}

.form-row label {
    width: 150px;
    font-size: 13px;
    color: #444;
    font-weight: bold;
    text-align: right;
    padding-right: 15px;
}

.form-row label span {
    color: red;
}

.form-row input {
    flex: 1;
    height: 36px;
    padding: 6px 12px;
    border: 1px solid #79b7e7;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
    background-color: #ffffff;
}

.form-row input:focus {
    border-color: #2b7bb9;
    box-shadow: 0 0 5px rgba(43, 123, 185, 0.3);
}

.button-row {
    margin-top: 25px;
}

.form-row button {
    background-color: #00a2ed;
    color: white;
    border: none;
    padding: 8px 22px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.form-row button:hover {
    background-color: #008cd4;
}

/* RESULT TABLE STYLES */
.result-box {
    margin-top: 25px;
    width: 100%;
}

.result-header {
    font-size: 15px;
    font-weight: bold;
    color: #2b7bb9;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
    background: #ffffff;
    border: 1px solid #dce3e8;
}

.gso-result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    text-align: left;
}

.gso-result-table th {
    background-color: #f1f5f8;
    color: #2b7bb9;
    font-weight: bold;
    padding: 10px;
    border: 1px solid #dce3e8;
    white-space: nowrap;
}

.gso-result-table td {
    padding: 10px;
    border: 1px solid #dce3e8;
    color: #333;
}

.btn-details {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 12px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
}

/* FOOTER */
.site-footer {
    text-align: center;
    font-size: 11px;
    color: #444;
    line-height: 1.6;
    margin-top: auto;
}

.site-footer a {
    color: #2b7bb9;
    text-decoration: underline;
}

/* RESPONSIVE DESIGN */
@media (max-width: 900px) {
    .page-wrapper {
        flex-direction: column;
    }
    .left-panel, .right-panel {
        width: 100%;
    }
    .form-row {
        flex-direction: column;
        align-items: flex-start;
    }
    .form-row label {
        width: 100%;
        text-align: left;
        margin-bottom: 5px;
    }
}
