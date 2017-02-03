import React from 'react';

const Note  = props => {

  let note = props.note;
  let noteBuffer;
  if (note.length == 1){
    noteBuffer = "--";
  } else if (note.length == 2){
    noteBuffer = "-";
  } else if (note.length == 0){
    note = "-";
    noteBuffer = "--";
  }

  let selectedNoteClass = "";
  if ((parseInt(props.editTrackId) == props.trackId) &&
      (parseInt(props.editNoteId) == props.id)){
        if (parseInt(props.editStringId) == props.stringId) {
          selectedNoteClass = "animated fadeIn selected";
        } else if (note != "-") {
          selectedNoteClass = "selected-chord";
        }
  }

  return(
    <div className='inline-block text'>
      <span>---</span>
      <span className={selectedNoteClass} id={props.id} data-track={props.trackId} data-string={props.stringId} onClick={props.handleSelect}>
        {note}
      </span>
      <span>{noteBuffer}</span>
    </div>
  );
};

export default Note;
