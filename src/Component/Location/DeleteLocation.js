const DeleteLocation = (props) => {
    const handleDelete = (locationId) => {
        const header = "Bearer " + sessionStorage.getItem('accessToken');
        console.log(props.location)
        fetch(`http://localhost:8081/api/location/${props.location}`, {
            method: 'DELETE',
            headers: {
                Authorization: header,
            }
        }).then((res) => {
            if (!res.ok) {
                throw Error("cannot be deleted")
            }
            return res.json()
        }).then((e) => {
            props.setMessage("Location deleted successfully")
            props.setIsOpenCon(false)
            window.location.reload();
        }).catch((err) => {
            props.setMessage(err.message)
        })
    }
    return (<>
        <div className='popupContainer' onClick={() => props.setIsOpenCon(false)}>
            <div className='popup-boxd' onClick={(e) => e.stopPropagation()}>
                <div className='popupHeader'>
                    <h2>Are you sure to delete this location?</h2>
                </div>
                <div className='buttonsContainer'>
                    <button type="submit" className="submit-btn" onClick={() => handleDelete(props.locationid)}>
                        Yes
                    </button>
                    <button type="reset" className="cancel-btn" onClick={() => props.setIsOpenCon(false)}>
                        No
                    </button>
                </div>
            </div>
        </div>
    </>
)}

export default DeleteLocation;