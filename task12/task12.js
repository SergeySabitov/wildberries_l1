const book = {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    yearOfPublication: 2008,
  
    // Методы для получения свойств
    getTitle: function () {
      return this.title;
    },
    getAuthor: function () {
      return this.author;
    },
    getYearOfPublication: function () {
      return this.yearOfPublication;
    },
  
    // Методы для изменения свойств
    setTitle: function (newTitle) {
      this.title = newTitle;
    },
    setAuthor: function (newAuthor) {
      this.author = newAuthor;
    },
    setYearOfPublication: function (newYear) {
      this.yearOfPublication = newYear;
    },
  };
  
  // Получение значений свойств
  console.log("Title:", book.getTitle());
  console.log("Author:", book.getAuthor());
  console.log("Year of Publication:", book.getYearOfPublication());
  
  // Изменение значений свойств
  book.setTitle("JavaScript: The Definitive Guide");
  book.setAuthor("David Flanagan");
  book.setYearOfPublication(2021);
  
  console.log("Updated Title:", book.getTitle());
  console.log("Updated Author:", book.getAuthor());
  console.log("Updated Year of Publication:", book.getYearOfPublication());