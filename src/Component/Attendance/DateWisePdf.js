import FileSaver from "file-saver";
import { BiDownload } from 'react-icons/bi';
const DayWisePdf = ({date}) => {
    console.log(date)
    const downloadPdf = (e) => {
      e.preventDefault();
        const header = "Bearer " + sessionStorage.getItem("accessToken");
        const locationId=sessionStorage.getItem("userLocationId")

        fetch(`http://localhost:8081/api/pdf/booking/day/${date}/location/${locationId}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: header,
          }
        }).then((response) => {
          return response.blob();
        }).then((blob) => {
          FileSaver.saveAs(blob, "dailydate.pdf");
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
    export default DayWisePdf;