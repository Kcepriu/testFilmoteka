export default class WorkWithStorage {
  #NAME_KEY_STORAGE_WATCHED = 'Filmoteka_List_Watched';
  #NAME_KEY_STORAGE_QUEUE = 'Filmoteka_List_Queue';
  #listQueue;
  #listWatched;

  constructor(countElementFromPage) {
    this.countElementFromPage = countElementFromPage;

    this.#listWatched = this.#readListWatched();
    this.#listQueue = this.#readListQueue();
  }

  //Interface
  addToWatch(element) {
    if (this.#isAlreadyAdd(element, this.#listWatched)) return;
    this.#listWatched.push(element);
    this.#writeListWatched();
  }

  addToQueue(element) {
    if (this.#isAlreadyAdd(element, this.#listQueue)) return;
    this.#listQueue.push(element);
    this.#writeListQueue();
  }

  getDataPageWatched(numberPage = 1) {
    return this.#getDataPageObject(this.#listWatched, numberPage);
  }

  getDataPageQueue(numberPage = 1) {
    return this.#getDataPageObject(this.#listQueue, numberPage);
  }

  deleteFromWatch() {
    //element.id - треба знайти елемент масиву з таким id
    // і грохнути його
  }

  #isAlreadyAdd(element, obj) {
    //TODO
    //Шукає, чи не додали раніше
    return obj.find(el => (el.id = element.id));
  }

  // * Read Write to Storage
  #readListWatched() {
    return this.#readDataFromStorage(this.#NAME_KEY_STORAGE_WATCHED);
  }

  #readListQueue() {
    return this.#readDataFromStorage(this.#NAME_KEY_STORAGE_QUEUE);
  }

  #writeListWatched() {
    localStorage.setItem(
      this.#NAME_KEY_STORAGE_WATCHED,
      JSON.stringify(this.#listWatched)
    );
  }

  #writeListQueue() {
    localStorage.setItem(
      this.#NAME_KEY_STORAGE_QUEUE,
      JSON.stringify(this.#listQueue)
    );
  }

  #readDataFromStorage(key) {
    try {
      const serializedState = localStorage.getItem(key);

      return serializedState === null ? [] : JSON.parse(serializedState);
    } catch (error) {
      return [];
    }
  }

  // * Get data
  #getDataPageObject(obj, numberPage) {
    const total_results = Object.keys(obj).length;
    const start = this.countElementFromPage * numberPage - 1;
    const end = start + this.countElementFromPage;

    return {
      page: Math.ceil(total_results / this.countElementFromPage),
      total_pages: numberPage,
      total_results: total_results,
      results: obj.slice(start, end),
    };
  }
}
