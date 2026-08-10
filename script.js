```javascript
// ======================================================
// BANGLADESH SEAFARER CERTIFICATE VERIFICATION
// DIAGNOSTIC VERSION
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("verificationForm");

    const certificateInput =
        document.getElementById("certificateNo");

    const dobInput =
        document.getElementById("dateOfBirth");

    const resultBox =
        document.getElementById("resultBox");


    if (!form || !certificateInput || !dobInput || !resultBox) {

        console.error("HTML elements missing.");

        return;
    }


    // --------------------------------------------------
    // CHECK SUPABASE
    // --------------------------------------------------

    if (typeof supabase === "undefined") {

        resultBox.style.display = "block";
        resultBox.className =
            "result-box result-error";

        resultBox.innerHTML = `
            <strong>SUPABASE LIBRARY ERROR</strong>
            <br><br>
            Supabase JavaScript library was not loaded.
        `;

        return;
    }


    // --------------------------------------------------
    // CREATE CLIENT
    // --------------------------------------------------

    const db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    console.log(
        "SUPABASE CLIENT CREATED"
    );


    // ==================================================
    // FORM
    // ==================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const certNo =
                certificateInput.value
                    .trim();

            const dob =
                dobInput.value;


            if (!certNo) {

                showResult(
                    "error",
                    "Please enter CDC No."
                );

                return;
            }


            if (!dob) {

                showResult(
                    "error",
                    "Please select Date of Birth."
                );

                return;
            }


            await verify(
                db,
                certNo,
                dob
            );

        }
    );


    // ==================================================
    // URL VERIFICATION
    // ==================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlCert =
        params.get("certNo");

    const urlDob =
        params.get("dob");


    if (urlCert && urlDob) {

        certificateInput.value =
            urlCert;

        dobInput.value =
            urlDob;

        verify(
            db,
            urlCert,
            urlDob
        );
    }

});


// ======================================================
// VERIFY
// ======================================================

async function verify(
    db,
    certNo,
    dob
) {

    showResult(
        "loading",
        `
        <strong>Checking database...</strong>
        <br><br>
        CDC: ${escapeHTML(certNo)}
        <br>
        DOB: ${escapeHTML(dob)}
        `
    );


    console.log(
        "================================"
    );

    console.log(
        "CDC:",
        certNo
    );

    console.log(
        "DOB:",
        dob
    );


    try {

        // ==================================================
        // TEST 1
        // GET ALL RECORDS
        // ==================================================

        console.log(
            "TEST 1: Reading certificates table..."
        );


        const test1 =
            await db
                .from("certificates")
                .select("*")
                .limit(10);


        console.log(
            "TEST 1 DATA:",
            test1.data
        );

        console.log(
            "TEST 1 ERROR:",
            test1.error
        );


        if (test1.error) {

            showResult(
                "error",
                `
                <strong>DATABASE ACCESS ERROR</strong>

                <br><br>

                ${escapeHTML(
                    test1.error.message ||
                    "Unknown database error"
                )}

                <br><br>

                <b>Error Code:</b>
                ${escapeHTML(
                    test1.error.code ||
                    "N/A"
                )}

                <br><br>

                <b>Details:</b>
                ${escapeHTML(
                    test1.error.details ||
                    "N/A"
                )}
                `
            );

            return;
        }


        // ==================================================
        // CHECK WHETHER ANY ROWS ARE VISIBLE
        // ==================================================

        if (
            !test1.data ||
            test1.data.length === 0
        ) {

            showResult(
                "error",
                `
                <strong>DATABASE CONNECTED</strong>

                <br><br>

                But the website cannot see any rows
                from the certificates table.

                <br><br>

                This is most likely an
                <strong>RLS / SELECT POLICY</strong>
                problem.
                `
            );

            return;
        }


        console.log(
            "VISIBLE RECORDS:",
            test1.data.length
        );


        // ==================================================
        // TEST 2
        // FIND CDC
        // ==================================================

        console.log(
            "TEST 2: Searching CDC..."
        );


        const test2 =
            await db
                .from("certificates")
                .select("*")
                .eq(
                    "certificate_no",
                    certNo
                )
                .limit(10);


        console.log(
            "TEST 2 DATA:",
            test2.data
        );

        console.log(
            "TEST 2 ERROR:",
            test2.error
        );


        if (test2.error) {

            showResult(
                "error",
                `
                <strong>CDC SEARCH ERROR</strong>

                <br><br>

                ${escapeHTML(
                    test2.error.message ||
                    "Unknown error"
                )}
                `
            );

            return;
        }


        if (
            !test2.data ||
            test2.data.length === 0
        ) {

            showResult(
                "error",
                `
                <strong>CDC NOT FOUND</strong>

                <br><br>

                The database is accessible,
                but CDC:

                <br><br>

                <strong>
                ${escapeHTML(certNo)}
                </strong>

                <br><br>

                was not returned.
                `
            );

            return;
        }


        // ==================================================
        // TEST 3
        // CHECK DOB
        // ==================================================

        const record =
            test2.data[0];


        console.log(
            "DATABASE RECORD:",
            record
        );


        console.log(
            "DATABASE DOB:",
            record.date_of_birth
        );

        console.log(
            "INPUT DOB:",
            dob
        );


        // ==================================================
        // COMPARE DOB
        // ==================================================

        const databaseDOB =
            String(
                record.date_of_birth
            ).substring(0, 10);


        if (
            databaseDOB !== dob
        ) {

            showResult(
                "error",
                `
                <strong>CDC FOUND — DOB DOES NOT MATCH</strong>

                <br><br>

                <b>CDC No.:</b>
                ${escapeHTML(
                    record.certificate_no
                )}

                <br><br>

                <b>Name:</b>
                ${escapeHTML(
                    record.name
                )}

                <br><br>

                <b>Database DOB:</b>
                ${escapeHTML(
                    formatDate(
                        databaseDOB
                    )
                )}

                <br><br>

                <b>You entered:</b>
                ${escapeHTML(
                    formatDate(dob)
                )}
                `
            );

            return;
        }


        // ==================================================
        // VERIFIED
        // ==================================================

        showResult(
            "success",
            `
            <strong>
                ✓ CDC VERIFIED
            </strong>

            <br><br>

            <b>CDC No.:</b>
            ${escapeHTML(
                record.certificate_no
            )}

            <br>

            <b>Name:</b>
            ${escapeHTML(
                record.name
            )}

            <br>

            <b>Rank:</b>
            ${escapeHTML(
                record.rank
            )}

            <br>

            <b>Date of Birth:</b>
            ${escapeHTML(
                formatDate(
                    record.date_of_birth
                )
            )}

            <br>

            <b>Date of Issue:</b>
            ${escapeHTML(
                formatDate(
                    record.issue_date
                )
            )}

            <br>

            <b>Date of Expiry:</b>
            ${escapeHTML(
                formatDate(
                    record.expiry_date
                )
            )}

            <br>

            <b>Status:</b>
            ${escapeHTML(
                record.status
            )}
            `
        );


    } catch (error) {

        console.error(
            "FINAL ERROR:",
            error
        );


        showResult(
            "error",
            `
            <strong>JAVASCRIPT / CONNECTION ERROR</strong>

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
        document.getElementById("resultBox");


    if (!resultBox) {

        return;
    }


    resultBox.style.display =
        "block";


    if (type === "success") {

        resultBox.className =
            "result-box result-success";

    } else if (type === "error") {

        resultBox.className =
            "result-box result-error";

    } else {

        resultBox.className =
            "result-box";
    }


    resultBox.innerHTML =
        message;
}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(value) {

    if (!value) {

        return "";
    }


    const parts =
        String(value).substring(0, 10).split("-");


    if (parts.length === 3) {

        return (
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );
    }


    return String(value);
}


// ======================================================
// SECURITY
// ======================================================

function escapeHTML(value) {

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
