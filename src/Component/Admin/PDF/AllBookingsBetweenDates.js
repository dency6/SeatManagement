import FileSaver from "file-saver";
import { useState } from "react";
const AllBookingsBetweenDates = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const downloadPdf = () => {
        const header = "Bearer " + sessionStorage.getItem("accessToken");
        const locationId=sessionStorage.getItem("userLocationId")
        fetch(`http://localhost:8081/api/pdf/bookings/dateWise/${fromDate}/${toDate}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: header,
          }
        }).then((response) => {
          return response.blob();
        }).then((blob) => {
          // Use FileSaver.js to save the blob as a file
          FileSaver.saveAs(blob, "admins.pdf");
        }).catch((error) => {
          console.error("Error downloading PDF:", error);
        });
      }
      
    return (
        <div>
          <img width="32" height="32" onClick={downloadPdf} src="https://img.icons8.com/fluency/48/microsoft-excel-2019.png" alt="microsoft-excel-2019"/>
        </div>
      );
    };
    export default AllBookingsBetweenDates;