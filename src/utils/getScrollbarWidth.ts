export function getScrollbarWidth(id = 'scroll-div-hidden') {

  const scrollDiv = document.createElement('div');

  scrollDiv.id = id;

  scrollDiv.style.visibility = 'hidden';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';

  document.body.appendChild(scrollDiv);

  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}
