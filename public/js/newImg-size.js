let verify = document.getElementById("verify");
const fileInput = document.getElementById("verify-img");
const errorContainer = document.getElementById("errorContainer");

fileInput.addEventListener("click", function () {
    if (fileInput.files.length == 1) {
        verify.checked = false;
        return;
    }
});
verify.addEventListener("click", function () {
    const maxSize = 200 * 1024; // 200KB in bytes
    console.log("click button");

    if (fileInput.files.length === 0) {
        errorContainer.innerText = "Please select an image to upload.";
        errorContainer.style.color = "red";
        if (errorContainer.innerText != "") {
        verify.checked = false;
        }
        return;
    }

    const file = fileInput.files[0];
    if (file.size > maxSize) {
        errorContainer.innerText = "File size exceeds the limit (200KB).";
        errorContainer.style.color = "red";
        if (errorContainer.innerText != "") {
        verify.checked = false;
        }
        return;
    }

    errorContainer.innerText = "";
});