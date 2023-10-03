const BookingRoom = () => {
    return ( <>
    
  <select id="bookingRoom" name="bookingRoom" required>
    <option value="">-- Select a room --</option>
    <option value="discussionRoom">Discussion Room</option>
    <option value="boardRoom">Board Room</option>
    
  </select>
    </> );
}
 
export default BookingRoom;