import { useState } from "react";
import { BsSaveFill } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
const AddSeatPopUp = ({ onHandleAdd, onHandleCancel,flag,setFlag }) => {
  const [name, setName] = useState(null);
  const [isOpenCon, setIsOpenCon] = useState(false);
  const handlePopup = () => {
    setIsOpenCon(true);
  };
  return (
    <>
      <div
        className="locationpopupContainer"
        onClick={() => setIsOpenCon(false)}
      >
        <div className="location-popup-boxd" >
          <b>Seat Name</b>
          <input 
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <button 
            onClick={() => {
              onHandleAdd(name);
            }}
          >
            Save
          </button>

           <MdCancel  onClick={() => {
              onHandleCancel();
            }}/>
        
        </div>
      </div>
    </>
  );
};

export default AddSeatPopUp;
