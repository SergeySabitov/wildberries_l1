class Shape {
    constructor() {
      // Пустой конструктор для базового класса Shape
    }
  
    area() {
      // Метод для расчета площади, должен быть переопределен в подклассах
    }
  
    perimeter() {
      // Метод для расчета периметра, должен быть переопределен в подклассах
    }
  }
  
  class Rectangle extends Shape {
    constructor(width, height) {
      super();
      this.width = width;
      this.height = height;
    }
  
    area() {
      return this.width * this.height;
    }
  
    perimeter() {
      return 2 * (this.width + this.height);
    }
  }
  
  class Circle extends Shape {
    constructor(radius) {
      super();
      this.radius = radius;
    }
  
    area() {
      return Math.PI * this.radius * this.radius;
    }
  
    perimeter() {
      return 2 * Math.PI * this.radius;
    }
  }
  
  class Triangle extends Shape {
    constructor(side1, side2, side3) {
      super();
      this.side1 = side1;
      this.side2 = side2;
      this.side3 = side3;
    }
  
    // Рассмотрим простейший случай равностороннего треугольника
    area() {
      const s = (this.side1 + this.side2 + this.side3) / 2;
      return Math.sqrt(s * (s - this.side1) * (s - this.side2) * (s - this.side3));
    }
  
    perimeter() {
      return this.side1 + this.side2 + this.side3;
    }
  }
  
  // Пример использования:
  
  const rectangle = new Rectangle(5, 10);
  console.log("Прямоугольник:");
  console.log("Площадь:", rectangle.area());
  console.log("Периметр:", rectangle.perimeter());
  
  const circle = new Circle(5);
  console.log("Круг:");
  console.log("Площадь:", circle.area());
  console.log("Периметр:", circle.perimeter());
  
  const triangle = new Triangle(3, 4, 5);
  console.log("Треугольник:");
  console.log("Площадь:", triangle.area());
  console.log("Периметр:", triangle.perimeter());
  