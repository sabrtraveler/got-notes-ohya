// assigning variables

let $noteTitle = $('.note-title')
let $noteText = $('.note-textarea')
let $saveNoteBtn = $('.save-note')
let $newNoteBtn = $('.new-note')
let $noteList = $('.list-container .list-group')

// assign empty object to activeNote to keep track of the note in the textarea
let activeNote = {}

// a function to get the notes from the DB
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// let getNotes = function () {
//   return $.ajax({
//     url: '/api/notes',
//     method: 'GET'
//   })
// }

// A function to save a note to the DB
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// let saveNote = function (note) {
//   return $.ajax({
//     url: '/api/notes',
//     data: note,
//     method: 'POST'
//   })
// }



// A function to delete a note from the DB
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// let deleteNote = function (id) {
//   return $.ajax({
//     url: 'api/notes/' + id,
//     method: 'DELETE'
//   })
// }


// if an activeNote exists show it, otherwise render empty inputs
const renderActiveNote = () => {
  hide($saveNoteBtn);

  if (activeNote.id) {
    $noteTitle.setAttribute('readonly', true);
    $noteText.setAttribute('readonly', true);
    $noteTitle.value = activeNote.title;
    $noteText.value = activeNote.text;
  } else {
    $noteTitle.removeAttribute('readonly');
    $noteText.removeAttribute('readonly');
    $noteTitle.value = '';
    $noteText.value = '';
  }
};


// let renderActiveNote = function () {
//   $saveNoteBtn.hide()

//   if (activeNote.id) {
//     $noteTitle.attr('readonly', true)
//     $noteText.attr('readonly', true)
//     $noteTitle.val(activeNote.title)
//     $noteText.val(activeNote.text)
//   } else {
//     $noteTitle.attr('readonly', false)
//     $noteText.attr('readonly', false)
//     $noteTitle.val('')
//     $noteText.val('')
//   }
// }

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// let handleNoteSave = function () {
//   let newNote = {
//     title: $noteTitle.val(),
//     text: $noteText.val()
//   }

//   saveNote(newNote).then(function (data) {
//     getAndRenderNotes()
//     renderActiveNote()
//   })
// }

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// let handleNoteDelete = function (event) {
//   // prevents the click listener for the list from being called when the button inside of it is clicked
//   event.stopPropagation()

//   let note = $(this)
//     .parent('.list-group-item')
//     .data()

//   if (activeNote.id === note.id) {
//     activeNote = {}
//   }

//   deleteNote(note.id).then(function () {
//     getAndRenderNotes()
//     renderActiveNote()
//   })
// }

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


// let handleNoteView = function () {
//   activeNote = $(this).data()
//   renderActiveNote()
// }

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// let handleNewNoteView = function () {
//   activeNote = {}
//   renderActiveNote()
// }

// hide the save button if note title or text is empty
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// let handleRenderSaveBtn = function () {
//   if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
//     $saveNoteBtn.hide()
//   } else {
//     $saveNoteBtn.show()
//   }
// }

// Render's the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

// let renderNoteList = function (notes) {
//   $noteList.empty()

//   let noteListItems = []



  for (let i = 0; i < notes.length; i++) {
    let note = notes[i]

    let $li = $("<li class='list-group-item'>").data(note)
    let $span = $('<span>').text(note.title)
    let $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    )

    $li.append($span, $delBtn)
    noteListItems.push($li)
  }

  $noteList.append(noteListItems)
}

// Gets notes from the db and renders them to the sidebar
let getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data)
  })
}

$saveNoteBtn.on('click', handleNoteSave)
$noteList.on('click', '.list-group-item', handleNoteView)
$newNoteBtn.on('click', handleNewNoteView)
$noteList.on('click', '.delete-note', handleNoteDelete)
$noteTitle.on('keyup', handleRenderSaveBtn)
$noteText.on('keyup', handleRenderSaveBtn)

// Gets and renders the initial list of notes
getAndRenderNotes()
