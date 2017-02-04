import React from 'react';
import Track from './Track';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      title: "",
      artist: "",
      song: "",
      editTrackId: "",
      editStringId: "",
      editNoteId: "",
      editNote: "",
      editBox: "hidden"
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillMount() {
    fetch(`/api/v1/songs/${this.props.songId}.json`,
      { method: 'get',
        credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          let errorMessage = `${response.status} ($response.statusText)`,
            error = new Error(errorMessage);
          throw(error);
        }
      })
      .then(response => response.json())
      .then(body => {
        let song = body.tab;
        let extra = this.props.width - (song.length % this.props.width);
        song = song.concat(Array(extra).fill(",,,,,"))
        // also remove extra blank notes if there are more than a lines worth at the end

        this.setState({ title: body.title,
                        artist: body.artist,
                        song: song});
                      })
      .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  handleSelect(event) {
    let editNoteId = event.target.id;
    let editNote = event.target.innerHTML;
    let editStringId= event.target.dataset.string;
    let editTrackId= event.target.dataset.track;
    let chordArray = this.state.song[editNoteId].split(",");
    if (editNote != "-") {
      document.getElementsByClassName("edit-box")[0].value = editNote;
    } else {
      document.getElementsByClassName("edit-box")[0].value = "";
    }
    this.setState({ editTrackId: editTrackId,
                    editStringId: editStringId,
                    editNoteId: editNoteId,
                    editNote: editNote,
                    editBox: ""});
  }

  handleEdit(event) {
    let song = this.state.song;
    let editNoteId = parseInt(this.state.editNoteId);
    let editStringId = parseInt(this.state.editStringId);
    let editTrackId = parseInt(this.state.editTrackId);
    let newNote = document.getElementsByClassName("edit-box")[0].value;
    let chordLocation = editNoteId + (editTrackId * this.props.width);
    let chordArray = song[chordLocation].split(",");
    chordArray[editStringId] = newNote;
    chordArray = chordArray.join();
    song[chordLocation] = chordArray;
    this.setState({ song: song,
                    editTrackId: "",
                    editStringId: "",
                    editNoteId: "",
                    editNote: "",
                    editBox: "hidden"});
  }

  handleDelete(event) {
    let song = this.state.song;
    let editNoteId = parseInt(this.state.editNoteId);
    let editStringId = parseInt(this.state.editStringId);
    let editTrackId = parseInt(this.state.editTrackId);
    let chordLocation = editNoteId + (editTrackId * this.props.width);
    let chordArray = song[chordLocation].split(",");
    chordArray[editStringId] = "";
    chordArray = chordArray.join();
    song[chordLocation] = chordArray;
    this.setState({ song: song,
                    editTrackId: "",
                    editStringId: "",
                    editNoteId: "",
                    editNote: "",
                    editBox: "hidden"});
  }

  handleInsert(event) {
   let song = this.state.song;
   let editNoteId = parseInt(this.state.editNoteId);
   let editTrackId = parseInt(this.state.editTrackId);
   let chordLocation = editNoteId + (editTrackId * this.props.width);
   song.splice(chordLocation + 1, 0, ",,,,,");
   let extra = this.props.width - (song.length % this.props.width);
   song = song.concat(Array(extra).fill(",,,,,"))
   this.setState({ song: song,
                   editTrackId: "",
                   editStringId: "",
                   editNoteId: "",
                   editNote: "",
                   editBox: "hidden"});
 }

 handleRemove(event) {
   let song = this.state.song;
   let editNoteId = parseInt(this.state.editNoteId);
   let editTrackId = parseInt(this.state.editTrackId);
   let chordLocation = editNoteId + (editTrackId * this.props.width);
   song.splice(chordLocation, 1);
   // also remove extra blank notes if there are more than a lines worth at the end
   this.setState({ song: song,
                   editTrackId: "",
                   editStringId: "",
                   editNoteId: "",
                   editNote: "",
                   editBox: "hidden"});
 }

  handleSave() {
    let data = {
        tab: this.state.song.join(";")
    };
    let jsonTab = JSON.stringify(data);

    fetch(`/api/v1/songs/${this.props.songId}.json`,
      { method: 'put',
        body: jsonTab,
        credentials: 'include'
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          let errorMessage = `${response.status} ($response.statusText)`,
            error = new Error(errorMessage);
            throw(error);
        }
      })
      .then(data => {
      })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  render() {
    let width = this.props.width;
    let song = this.state.song;

    let tracks = [];
    let trackNotes = [];
    let hidden;
    let trackCount = Math.ceil(song.length/width);
    if (trackCount == 0) {
      trackCount = 1;
    }
    for (let i = 0; i < trackCount; i++) {
      hidden = "";
      trackNotes = song.slice(i * width, (i + 1) * width);
      if (i < trackCount - 1) {
        hidden = 'hidden';
      }
      let track = <Track
                    key = {i}
                    id = {i}
                    strings={this.props}
                    song={trackNotes}
                    hidden={hidden}
                    editTrackId={this.state.editTrackId}
                    editStringId={this.state.editStringId}
                    editNoteId={this.state.editNoteId}
                    handleSelect={this.handleSelect}
                  />;
      tracks.push(track);
    }

    return(
      <div className="animated fadeIn">
        <h3>{this.state.title} - {this.state.artist}</h3>
        <br/>
        <ul>
          {tracks}
        </ul>
        <button className="button columns small-2" onClick={() => this.handleSave()}>Save</button>
        <div className={this.state.editBox}>
          <form className='columns small-2'>
            <input className='edit-box' type="text"/>
          </form>
          <button className="button columns small-2" onClick={() => this.handleEdit()}>Add/Edit</button>
          <button className="button columns small-2" onClick={() => this.handleDelete()}>Delete</button>
          <button className="button columns small-2" onClick={() => this.handleInsert()}>Insert</button>
          <button className="button columns small-2" onClick={() => this.handleRemove()}>Remove</button>
        </div>
      </div>
    );
  }
}

export default App;
