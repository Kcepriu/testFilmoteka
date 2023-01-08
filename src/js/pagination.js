export default class Pagination {
  constructor(classNameElementPagination, clallBackOnClickButton) {
    this.containetPagination = document.querySelector(
      `.${classNameElementPagination}`
    );

    //Функція, яка викликається при натисканні на номеру сторінки
    this.containetPagination.addEventListener(
      'onClick',
      clallBackOnClickButton
    );
  }

  createPagination(numCurrentPage, totalPages, full = true) {
    // Якщо всього сторінок менше 7 чи 5 то просто виводимо їх
    // Якщо більше то виводимо із кнопками вперед назад
    // якщо на першій сторінці то не показуємо ПОПЕРЕДНЯ, якщо на останній то не показуємо НАСТУПНА
    // 1 ... 2 3 4 .. 6 >
    // < 2 ...  3 4 5 ... 7 >
    // < 2 ...  3 4 5 ... 7 >
  }
}
