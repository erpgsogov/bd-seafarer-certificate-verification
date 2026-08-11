```javascript
// ======================================================
// BANGLADESH SEAFARER CERTIFICATE VERIFICATION
// FINAL VERSION
// ======================================================

// ======================================================
// SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


// ======================================================
// START APPLICATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("BANGLADESH SEAFARER VERIFICATION");
    console.log("APPLICATION STARTED");
    console.log("====================================");


    // --------------------------------------------------
    // GET HTML ELEMENTS
    // --------------------------------------------------

    const form =
        document.getElementById("verificationForm");

    const certificateInput =
        document.getElementById("certificateNo");

    const dobInput =
        document.getElementById("dateOfBirth");

    const resultBox =
        document.getElementById("resultBox");

    const verifyButton =
        document.getElementById("verifyButton");


    // --------------------------------------------------
    // CHECK HTML
    // --------------------------------------------------

    if (
        !form ||
        !certificateInput ||
        !dobInput ||
        !resultBox
    ) {

        console.error(
            "Required HTML elements are missing."
        );

        return;
    }


    // --------------------------------------------------
    // CHECK SUPABASE LIBRARY
    // --------------------------------------------------

    if (
        typeof window.supabase === "undefined"
    ) {

        showResult(
            "error",
            `
            <strong>SUPABASE LIBRARY ERROR</strong>
            <br><br>
            Supabase JavaScript library was not loaded.
            <br><br>
            Please check the internet connection
            and make sure the Supabase CDN is loaded
            before script.js.
            `
        );

        return;
    }


    // --------------------------------------------------
    // CREATE SUPABASE CLIENT
    // --------------------------------------------------

    const db =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    console.log(
        "SUPABASE CLIENT CREATED SUCCESSFULLY"
    );


    // ==================================================
    // FORM SUBMIT
    // ==================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ------------------------------------------
            // GET INPUT VALUES
            // ------------------------------------------

            const certNo =
                certificateInput.value
                    .trim()
                    .toUpperCase();

            const dob =
                dobInput.value.trim();


            console.log(
                "INPUT CDC:",
                certNo
            );

            console.log(
                "INPUT DOB:",
                dob
            );


            // ------------------------------------------
            // VALIDATE CDC
            // ------------------------------------------

            if (!certNo) {

                showResult(
                    "error",
                    `
                    <strong>ERROR</strong>
                    <br><br>
                    Please enter CDC No.
                    `
                );

                certificateInput.focus();

                return;
            }


            // ------------------------------------------
            // VALIDATE DOB
            // ------------------------------------------

            if (!dob) {

                showResult(
                    "error",
                    `
                    <strong>ERROR</strong>
                    <br><br>
                    Please select Date of Birth.
                    `
                );

                dobInput.focus();

                return;
            }


            // ------------------------------------------
            // DISABLE BUTTON
            // ------------------------------------------

            if (verifyButton) {

                verifyButton.disabled = true;

                verifyButton.innerText =
                    "CHECKING...";
            }


            // ------------------------------------------
            // VERIFY
            // ------------------------------------------

            await verifyCertificate(
                db,
                certNo,
                dob
            );


            // ------------------------------------------
            // ENABLE BUTTON
            // ------------------------------------------

            if (verifyButton) {

                verifyButton.disabled = false;

                verifyButton.innerText =
                    "VERIFY CERTIFICATE";
            }

        }
    );


    // ==================================================
    // URL AUTO VERIFICATION
    //
    // Example:
    //
    // index.html?certNo=BD123456&dob=1990-01-01
    //
    // ==================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlCertNo =
        params.get("certNo");

    const urlDob =
        params.get("dob");


    if (
        urlCertNo &&
        urlDob
    ) {

        certificateInput.value =
            urlCertNo.trim().toUpperCase();

        dobInput.value =
            urlDob.trim();


        verifyCertificate(
            db,
            urlCertNo.trim().toUpperCase(),
            urlDob.trim()
        );
    }

});


// ======================================================
// VERIFY CERTIFICATE
// ======================================================

async function verifyCertificate(
    db,
    certNo,
    dob
) {

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    showResult(
        "loading",
        `
        <strong>Checking certificate...</strong>
        <br><br>
        Please wait.
        `
    );


    console.log("------------------------------------");
    console.log("VERIFY START");
    console.log("CDC:", certNo);
    console.log("DOB:", dob);
    console.log("------------------------------------");


    try {

        // ==================================================
        // DATABASE QUERY
        // ==================================================

        const {
            data,
            error
        } = await db
            .from("certificates")
            .select(
                `
                certificate_no,
                name,
                rank,
                date_of_birth,
                issue_date,
                expiry_date,
                status
                `
            )
            .eq(
                "certificate_no",
                certNo
            )
            .limit(20);


        // ==================================================
        // DATABASE ERROR
        // ==================================================

        if (error) {

            console.error(
                "SUPABASE ERROR:",
                error
            );


            showResult(
                "error",
                `
                <strong>DATABASE ERROR</strong>

                <br><br>

                ${escapeHTML(
                    error.message ||
                    "Unable to access database."
                )}

                <br><br>

                <b>Error Code:</b>
                ${escapeHTML(
                    error.code || "N/A"
                )}

                <br><br>

                <b>Details:</b>
                ${escapeHTML(
                    error.details || "N/A"
                )}
                `
            );

            return;
        }


        // ==================================================
        // CDC NOT FOUND
        // ==================================================

        if (
            !data ||
            data.length === 0
        ) {

            console.log(
                "CDC NOT FOUND:",
                certNo
            );


            showResult(
                "error",
                `
                <strong>✗ CDC NOT FOUND</strong>

                <br><br>

                CDC No.
                <b>${escapeHTML(certNo)}</b>
                was not found in the database.

                <br><br>

                Please check the CDC number
                and try again.
                `
            );

            return;
        }


        console.log(
            "CDC RECORDS FOUND:",
            data.length
        );


        // ==================================================
        // FIND RECORD WITH MATCHING DOB
        // ==================================================

        let matchedRecord = null;


        for (
            const record of data
        ) {

            const databaseDOB =
                normalizeDate(
                    record.date_of_birth
                );


            console.log(
                "DATABASE DOB:",
                databaseDOB
            );


            console.log(
                "ENTERED DOB:",
                dob
            );


            if (
                databaseDOB === dob
            ) {

                matchedRecord =
                    record;

                break;
            }
        }


        // ==================================================
        // DOB DOES NOT MATCH
        // ==================================================

        if (!matchedRecord) {

            const firstRecord =
                data[0];


            showResult(
                "error",
                `
                <strong>✗ NOT VERIFIED</strong>

                <br><br>

                CDC No.:
                <b>
                ${escapeHTML(
                    firstRecord.certificate_no || certNo
                )}
                </b>

                <br><br>

                Date of Birth does not match
                our records.

                <br><br>

                Please enter the correct
                Date of Birth.
                `
            );

            return;
        }


        // ==================================================
        // VERIFIED
        // ==================================================

        console.log(
            "CERTIFICATE VERIFIED:",
            matchedRecord
        );


        showResult(
            "success",
            `
            <strong>✓ CDC VERIFIED</strong>

            <br><br>

            <b>CDC No.:</b>
            ${escapeHTML(
                matchedRecord.certificate_no || ""
            )}

            <br>

            <b>Name:</b>
            ${escapeHTML(
                matchedRecord.name || ""
            )}

            <br>

            <b>Rank:</b>
            ${escapeHTML(
                matchedRecord.rank || ""
            )}

            <br>

            <b>Date of Birth:</b>
            ${formatDate(
                matchedRecord.date_of_birth
            )}

            <br>

            <b>Date of Issue:</b>
            ${formatDate(
                matchedRecord.issue_date
            )}

            <br>

            <b>Date of Expiry:</b>
            ${formatDate(
                matchedRecord.expiry_date
            )}

            <br>

            <b>Status:</b>
            ${escapeHTML(
                matchedRecord.status || ""
            )}
            `
        );


    } catch (error) {

        console.error(
            "VERIFICATION ERROR:",
            error
        );


        showResult(
            "error",
            `
            <strong>CONNECTION ERROR</strong>

            <br><br>

            ${escapeHTML(
                error.message ||
                String(error)
            )}
            `
        );
    }
}


// ======================================================
// SHOW RESULT
// ======================================================

function showResult(
    type,
    message
) {

    const resultBox =
        document.getElementById(
            "resultBox"
        );


    if (!resultBox) {

        console.error(
            "resultBox not found."
        );

        return;
    }


    resultBox.style.display =
        "block";


    if (
        type === "success"
    ) {

        resultBox.className =
            "result-box result-success";

    }

    else if (
        type === "error"
    ) {

        resultBox.className =
            "result-box result-error";

    }

    else {

        resultBox.className =
            "result-box";
    }


    resultBox.innerHTML =
        message;
}


// ======================================================
// NORMALIZE DATE
// ======================================================

function normalizeDate(
    value
) {

    if (!value) {

        return "";
    }


    const date =
        String(value)
            .substring(0, 10);


    return date;
}


// ======================================================
// FORMAT DATE
// DATABASE:
// YYYY-MM-DD
//
// DISPLAY:
// DD-MM-YYYY
// ======================================================

function formatDate(
    value
) {

    const date =
        normalizeDate(value);


    if (!date) {

        return "";
    }


    const parts =
        date.split("-");


    if (
        parts.length === 3
    ) {

        return escapeHTML(
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );
    }


    return escapeHTML(date);
}


// ======================================================
// HTML SECURITY
// ======================================================

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}
```
