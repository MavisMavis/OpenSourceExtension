/* global loadStoredImages, removeStoredImages */

"use strict";

class NavigateCollectionUI {
  constructor(containerEl) {
    this.containerEl = containerEl;

    this.state = {
      storedImages: [],
    };

    this.onFilterUpdated = this.onFilterUpdated.bind(this);
    this.onReload = this.onFilterUpdated;
    this.onDelete = this.onDelete.bind(this);

    this.containerEl.querySelector("button.reload").onclick = this.onReload;
    this.containerEl.querySelector("button.delete").onclick = this.onDelete;
    this.containerEl.querySelector("input.image-filter").onchange = this.onFilterUpdated;

    //edited
    this.containerEl.querySelector("select.select-number").onchange = this.onSelect;

    // Load the stored image once the component has been rendered in the page.
    this.onFilterUpdated();
  }

  get imageFilterValue() {
    return this.containerEl.querySelector("input.image-filter").value;
  }

  set imageFilterValue(value) {
    return this.containerEl.querySelector("input.image-filter").value = value;
  }

  setState(state) {
    // Merge the new state on top of the previous one and re-render everything.
    this.state = Object.assign(this.state, state);
    this.render();
  }

  componentDidMount() {
    // Load the stored image once the component has been rendered in the page.
    this.onFilterUpdated();
  }

  onFilterUpdated() {
    loadStoredImages(this.imageFilterValue)
      .then((storedImages) => {
        this.setState({storedImages});
      })
      .catch(console.error);
  }

  onDelete() {
    const {storedImages} = this.state;
    this.setState({storedImages: []});

    removeStoredImages(storedImages).catch(console.error);
  }

  render() {
    const {storedImages} = this.state;

    const thumbnailsUl = this.containerEl.querySelector("ul.thumbnails");
    while (thumbnailsUl.firstChild) {
      thumbnailsUl.removeChild(thumbnailsUl.firstChild);
    }

    storedImages.forEach(({storedName, blobUrl}) => {
      const onClickedImage = () => {
        this.imageFilterValue = storedName;
        this.onFilterUpdated();
      };
      const li = document.createElement("li");
      const img = document.createElement("img");
      li.setAttribute("id", storedName);
      img.setAttribute("src", blobUrl);
      img.onclick = onClickedImage;

      li.appendChild(img);
      thumbnailsUl.appendChild(li);
    });
  }
  /* edit */

  get optionValue() {
    return this.containerEl.querySelector("select.select-number").value;
  }

  set optionValue(value) {
    return this.containerEl.querySelector("select.select-number").value = value;
  }

  onSelect(){
    const {storedImages} = this.state;
    storedImages.forEach(({storedName}) => {
      const onClickedImage = () => {
        this.optionValue = storedName;
      };
      var select = document.getElementById("selectNumber");
      
      select.onselect = onClickedImage;
      var el = document.createElement("option");
      el.setAttribute("id", storedName);
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
      

     
    });
    
    // var select = document.getElementById("selectNumber");
    // var options = ["1", "2", "3", "4", "5"];
    // for(var i = 0; i < storedName.length; i++) {
    //     var opt = storedName[i];
    //     var el = document.createElement("option");
    //     el.textContent = opt;
    //     el.value = opt;
    //     select.appendChild(el);
    
  }
}

// eslint-disable-next-line no-unused-vars
const navigateCollectionUI = new NavigateCollectionUI(document.getElementById('app'));

