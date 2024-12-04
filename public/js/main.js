// public/js/main.js

document.addEventListener("DOMContentLoaded", function () {
    const imageName = document.getElementById("imageName").value;
    const folderName = document.getElementById("folderName").value;
    const bucketName = document.getElementById("bucketName").value;
    const statusDiv = document.getElementById("status");
  
    // Function to check if the processed image is available
    function checkProcessingStatus() {
      fetch(
        `/check-status?imageName=${encodeURIComponent(
          imageName
        )}&bucketName=${encodeURIComponent(
          bucketName
        )}&folderName=${encodeURIComponent(folderName)}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.processed) {
            // Redirect to the processed image page
            window.location.href = `/processed?imageName=${encodeURIComponent(
              imageName
            )}&bucketName=${encodeURIComponent(
              bucketName
            )}&folderName=${encodeURIComponent(folderName)}`;
          } else {
            // Update status and check again after a delay
            statusDiv.textContent = "Still processing...";
            setTimeout(checkProcessingStatus, 5000); // Check every 5 seconds
          }
        })
        .catch((error) => {
          console.error("Error checking processing status:", error);
          statusDiv.textContent =
            "An error occurred while checking the processing status.";
        });
    }
  
    // Start checking the processing status
    checkProcessingStatus();
  });
  