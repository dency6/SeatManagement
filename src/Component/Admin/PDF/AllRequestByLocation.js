import FileSaver from "file-saver";
import { BiDownload } from 'react-icons/bi';
const AllRequest
 = () => {

    const downloadPdf = () => {
        const header = "Bearer " + sessionStorage.getItem("accessToken");
        const locationId=sessionStorage.getItem("userLocationId")
        fetch(`http://localhost:8081/api/pdf/request/location/${locationId}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: header,
          }
        }).then((response) => {
          return response.blob();
        }).then((blob) => {
          // Use FileSaver.js to save the blob as a file
          FileSaver.saveAs(blob, "request.pdf");
        }).catch((error) => {
          console.error("Error downloading PDF:", error);
        });
      }
      
    return (
      <div >  
          <img width="32" height="32" onClick={downloadPdf} src="https://img.icons8.com/fluency/48/microsoft-excel-2019.png" alt="microsoft-excel-2019"/>
    </div>
      );
    };
    export default AllRequest
    ;