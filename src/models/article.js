import {useState} from "react";

export default function articleModel() {
  //
  const [willDeleted, setWillDeleted] = useState({
    data: {},
    displayDeleteModal: false
  });

  const [displayCategoryManager, setCategoryTagManager] = useState(false);


  return {
    willDeleted, setWillDeleted, displayCategoryManager, setCategoryTagManager
  }
}
