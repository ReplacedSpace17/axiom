class AddExpModel {
  constructor() {
      this.title = "";
      this.description = "";
      this.tags = [];
      this.referenceCID = [];
      this.authors = [];
      this.files = []; // Nuevo atributo para almacenar los archivos
  }

  setTitle(title) {
      this.title = title;
  }

  setDescription(description) {
      this.description = description;
  }

  setTags(tags) {
      if (Array.isArray(tags)) {
          this.tags = tags;
      } else {
          console.error("Tags must be an array");
      }
  }

  setReferenceCID(referenceCID) {
      if (Array.isArray(referenceCID)) {
          this.referenceCID = referenceCID;
      } else {
          console.error("Reference CID must be an array");
      }
  }
  setAuthors(authors) {
        if (Array.isArray(authors)) {
            this.authors = authors;
        } else {
            console.error("Authors must be an array");
        }
    }

  addAuthor(name, orcid, affiliation) {
      const newAuthor = { name, orcid, affiliation };
      this.authors.push(newAuthor);
  }

  // Método para actualizar los archivos
  setFiles(files) {
      if (Array.isArray(files)) {
          this.files = files;
      } else {
          console.error("Files must be an array");
      }
  }
}

export default AddExpModel;
/*
const expModel = new AddExpModel();
expModel.setTitle("Blockchain Research");
expModel.setDescription("A study on decentralized networks.");
expModel.setTags(["blockchain", "decentralized", "research"]);
expModel.setReferenceCID(["Qm123abc", "Qm456def"]);
expModel.addAuthor("Dr. Alice Smith", "0000-0001-2345-6789", "University of Blockchain");
expModel.addAuthor("Prof. Bob Johnson", "0000-0002-3456-7890", "Decentralized Tech Institute");
*/