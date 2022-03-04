function createElements(type, elements, {
  className,
  eventList
}) {
  console.log(eventList);
  return [`<${type} class=${className? className : ""}>${elements[0]}</${type}>`, eventList? [...eventList, ...elements[1]] : elements[1] ];
}

function div(elements, {
  className,
  eventList
}) {
  return createElements("div", elements, { className, eventList });
}

function li(elements, className) {
  return createElements("li", elements, { className, eventList });
}

function ul(elements, className) {
  return createElements("ul", elements, { className, eventList });
}

export default {
  createElements,
  div, 
  li,
  ul
}