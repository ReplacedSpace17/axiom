class AddExpModel {
    // Atributos del modelo
    
    
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
        //console.log("Title: ", this.title);
    }
  
    setDescription(description) {
        //console.log("Description: ", description);
        this.description = description;
    }
  
    setTags(tags) {
        if (Array.isArray(tags)) {
            this.tags = tags;
            //console.log("Tags: ", this.tags);
        } else {
            console.error("Tags must be an array");
        }
    }
  
    setReferenceCID(referenceCID) {
        if (Array.isArray(referenceCID)) {
            this.referenceCID = referenceCID;
            //console.log("Reference CID: ", this.referenceCID);
        } else {
            console.error("Reference CID must be an array");
        }
    }
  
    setAuthors(authors) {
        if (Array.isArray(authors)) {
            this.authors = authors;
            //console.log("Authors: ", this.authors);
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
            //console.log("Files: ", this.files);
        } else {
            console.error("Files must be an array");
        }
    }
    
    // Método para imprimir el objeto como JSON
    toJSON() {
        return JSON.stringify({
            title: this.title,
            description: this.description,
            tags: this.tags,
            referenceCID: this.referenceCID,
            authors: this.authors,
            files: this.files
        }, null, 2); // La segunda parte (2) es para darle formato legible al JSON
    }

    //imprimir todos los datos
    printAll(){
        //console.log("Title: ", this.title);
        //console.log("Description: ", this.description);
        //console.log("Tags: ", this.tags);
        //console.log("Reference CID: ", this.referenceCID);
        //console.log("Authors: ", this.authors);
        //console.log("Files: ", this.files);
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