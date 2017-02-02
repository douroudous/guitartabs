import React from 'react';
import String from './String';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      // chord: new Array(this.props.strings.data.length)
    };
  }

  render() {

    let strings = this.props.strings.data.map (string => {

      let song = this.props.song;
      let stringNumber = string.id;
      let stringLine = [];
      let stringNote = {};
      let note;
      for (let i = 0; i < song.length; i++) {
          note = song[i].split(',');
          stringNote = {
                        id: i,
                        stringNumber: stringNumber,
                        note: note[stringNumber]
                     };
          stringLine.push(stringNote);
      }

      return(
        <String
          key = {stringNumber}
          id = {stringNumber}
          open={string.open}
          stringLine={stringLine}
          entry={this.props.chord[stringNumber]}
          handleEnter={this.props.handleEnter}
        />
      );
    });


      return (
        <div className="page">
          <br/>
          <ul>
            {strings}
          </ul>
        </div>
      );
  }
}

export default Track;
