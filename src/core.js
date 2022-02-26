


function createElement(type, children, props) {
  const $dom = document.createElement(type);

  const $child = children instanceof HTMLElement? children : document.createTextNode(children);

  if($dom instanceof HTMLElement) {
    $dom.appendChild($child);

    if(props) {
      for(const key in props) {
  
        if(key !== "style") {
          $dom[key] = props[key];
        } else {
          for(const style in props[key]) {
            $dom[key][style] = props[key][style];
          }
        }
      }
    }

  } 

  return $dom;
}

export {
  createElement
}